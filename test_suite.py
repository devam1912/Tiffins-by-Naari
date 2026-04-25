import requests
import time
import sys

# ==========================================
# CONFIGURATION (Render Deployment)
# ==========================================
BASE_URL = "https://tiffins-by-naari.onrender.com"
BACKEND_URL = f"{BASE_URL}/api"
FRONTEND_URL = BASE_URL
GEO_LOC = {"lat": 23.1883, "lng": 72.6275} # DAIICT Gandhinagar

# ==========================================
# COLOR UTILITIES
# ==========================================
IS_WINDOWS = sys.platform == "win32"
if IS_WINDOWS:
    import os
    os.system("") 

class Colors:
    PASS = '\033[92m'    # Green
    FAIL = '\033[91m'    # Red
    INFO = '\033[94m'    # Blue
    BOLD = '\033[1m'
    DIM  = '\033[2m'
    END  = '\033[0m'

# ==========================================
# TEST ENGINE
# ==========================================
token = None
test_user = {
    "name": "Audit Admin Bot",
    "email": f"admin_audit_{int(time.time())}@test.com",
    "password": "Password123",
    "role": "admin"
}

def print_separator(title=None):
    if title:
        print(f"\n{Colors.BOLD}Testing Module: {title}{Colors.END}")
        print("=" * 60)
    else:
        print("-" * 60)

def run_test(name, method, endpoint, func):
    start_time = time.time()
    try:
        success, actual_status, expected_status, message = func()
        duration = time.time() - start_time
        
        status_color = Colors.PASS if success else Colors.FAIL
        icon = "✓" if success else "✗"
        label = "PASS" if success else "FAIL"

        print(f"{status_color}{icon} {label} {name}{Colors.END}")
        print(f"  {Colors.DIM}Method: {method} | Endpoint: {endpoint}{Colors.END}")
        print(f"  {Colors.DIM}Status: {actual_status} (Expected: {expected_status}) | Time: {duration:.3f}s{Colors.END}")
        if not success:
            print(f"  {Colors.FAIL}Error: {message}{Colors.END}")
        print()
    except Exception as e:
        print(f"{Colors.FAIL}✗ ERROR {name}{Colors.END}")
        print(f"  {Colors.FAIL}Exception: {str(e)}{Colors.END}\n")

# ==========================================
# TEST DEFINITIONS
# ==========================================

def api_check(path, method="GET", json_data=None, use_token=False):
    headers = {"Authorization": f"Bearer {token}"} if use_token and token else {}
    try:
        if method == "GET":
            res = requests.get(f"{BACKEND_URL}{path}", headers=headers, timeout=10)
        else:
            res = requests.post(f"{BACKEND_URL}{path}", json=json_data, headers=headers, timeout=10)
        return res
    except Exception as e:
        return None

# --- Connectivity ---
def check_health():
    res = api_check("/health")
    if not res: return False, "ECONN", 200, "Connection Refused"
    return res.status_code == 200, res.status_code, 200, "API operational"

def check_db():
    res = api_check("/tiffins/menu")
    if not res: return False, "ECONN", 200, "DB Bridge Failed"
    return res.status_code == 200, res.status_code, 200, "Menu data retrieved"

# --- Authentication ---
def check_register():
    res = api_check("/auth/register", "POST", test_user)
    if not res: return False, "ECONN", 201, "Reg Failed"
    return res.status_code in [200, 201], res.status_code, 201, "User registered"

def check_login():
    global token
    res = api_check("/auth/login", "POST", {"email": test_user["email"], "password": test_user["password"]})
    if res and res.status_code == 200:
        token = res.json().get("token")
        return True, 200, 200, "Token obtained"
    status = res.status_code if res else "ECONN"
    return False, status, 200, "Identity verification failed"

# --- Discovery ---
def check_nearby():
    res = api_check(f"/tiffins/nearby?lat={GEO_LOC['lat']}&lng={GEO_LOC['lng']}")
    if not res: return False, "ECONN", 200, "Geo failed"
    return res.status_code == 200, res.status_code, 200, "Nearby results found"

# --- Business ---
def check_cart():
    res = api_check("/cart", use_token=True)
    if not res: return False, "ECONN", 200, "Cart error"
    return res.status_code == 200, res.status_code, 200, "Cart accessible"

def check_orders():
    res = api_check("/orders/customer", use_token=True)
    if not res: return False, "ECONN", 200, "Orders error"
    return res.status_code == 200, res.status_code, 200, "Order history reachable"

def check_recs():
    res = api_check(f"/recommendations/nearby?lat={GEO_LOC['lat']}&lng={GEO_LOC['lng']}", use_token=True)
    if not res: return False, "ECONN", 200, "AI error"
    return res.status_code == 200, res.status_code, 200, "ML Recommendations live"

# ==========================================
# EXECUTION
# ==========================================

print(f"\n{Colors.BOLD}🚀 {Colors.INFO}TIFFINS-BY-NAARI FULL SYSTEM DIAGNOSTIC{Colors.END}")

print_separator("System Foundations")
run_test("API Server Health", "GET", "/health", check_health)
run_test("MongoDB Live Link", "GET", "/tiffins/menu", check_db)

print_separator("Authentication & Identity")
run_test("Admin User Registration", "POST", "/auth/register", check_register)
run_test("JWT Session Generation", "POST", "/auth/login", check_login)

print_separator("Geographic Discovery")
run_test("Nearby Kitchen Search", "GET", "/tiffins/nearby", check_nearby)

print_separator("Business & Logic")
run_test("Shopping Cart State", "GET", "/cart", check_cart)
run_test("Order Management Subsystem", "GET", "/orders/customer", check_orders)

print_separator("Artificial Intelligence")
run_test("ML Recommendation Engine", "GET", "/recommendations/nearby", check_recs)

print("=" * 60)
print(f"{Colors.BOLD}Diagnostic Report Complete.{Colors.END}\n")
