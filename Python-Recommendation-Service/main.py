import os
from fastapi import FastAPI
import pandas as pd
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Replace with the connection link provided
MONGO_URI = os.environ.get("MONGO_URI")
if not MONGO_URI:
    raise ValueError("No MONGO_URI set in environment variables")

client = MongoClient(MONGO_URI)

# The default database for the cluster
db = client["test"] 
collection = db["orders"]

def prepare_items(user_id: str):
    # Retrieve user orders
    try:
        user_object_id = ObjectId(user_id)
        data = list(collection.find({"user": user_object_id}))
        # Fallback to string search if not found
        if not data:
            data = list(collection.find({"user": user_id}))
    except Exception:
        data = list(collection.find({"user": user_id}))
        
    items_list = []
    
    for order in data:
        items = order.get('items', [])
        time_slot = order.get('timeSlot', 'lunch')
        for item in items:
            name = item.get('name')
            if name:
                items_list.append({
                    "item_name": name,
                    "category": item.get('itemType', 'unknown'),
                    "quantity": item.get('quantity', 1),
                    "timeSlot": time_slot
                })
                
    return pd.DataFrame(items_list)

def get_top_picks(items_df):
    if items_df.empty:
        return []

    item_freq = items_df.groupby("item_name")["quantity"].sum()
    item_freq_norm = item_freq / item_freq.max() if item_freq.max() > 0 else 0

    cat_freq = items_df.groupby("category")["quantity"].sum()
    cat_norm = cat_freq / cat_freq.max() if cat_freq.max() > 0 else 0

    items_df["item_score"] = items_df["item_name"].map(item_freq_norm)
    items_df["cat_score"] = items_df["category"].map(cat_norm)
    items_df["time_score"] = items_df["timeSlot"].apply(lambda x: 1)

    items_df["final_score"] = (
        items_df["item_score"] * 0.6 +
        items_df["cat_score"] * 0.3 +
        items_df["time_score"] * 0.1
    )

    recommendations = (
        items_df.sort_values("final_score", ascending=False)
        .drop_duplicates("item_name")
        .head(5)
    )

    return recommendations["item_name"].tolist()

def recommend_similar(items_df, item_name):
    if items_df.empty:
        return []
        
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    items_df['features'] = items_df['item_name'].astype(str) + " " + items_df['category'].fillna("").astype(str)

    try:
        tfidf = TfidfVectorizer()
        tfidf_matrix = tfidf.fit_transform(items_df['features'])
        similarity = cosine_similarity(tfidf_matrix)
    except ValueError:
        return []

    indices = items_df[items_df['item_name'] == item_name].index.tolist()
    if not indices:
        return []

    idx = indices[0]
    scores = list(enumerate(similarity[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)

    result = []
    seen = set()

    for i, _ in scores[1:]:
        name = items_df.iloc[i]['item_name']

        if name not in seen and name != item_name:
            result.append(name)
            seen.add(name)

        if len(result) == 5:
            break

    return result

@app.get("/recommendations/{user_id}")
def get_recommendations(user_id: str):
    items_df = prepare_items(user_id)

    if items_df.empty:
        return {"top_picks": [], "similar_items": []}

    top_picks = get_top_picks(items_df)

    similar_items = recommend_similar(items_df, top_picks[0]) if top_picks else []

    return {
        "top_picks": top_picks,
        "similar_items": similar_items
    }
