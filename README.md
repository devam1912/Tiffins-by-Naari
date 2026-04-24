# Tiffins-by-Naari

**🔗 Live Demo:** [https://tiffins-by-naari.onrender.com/](https://tiffins-by-naari.onrender.com/)

Tiffins-by-Naari is a comprehensive web platform designed to seamlessly connect home-cooked tiffin service providers with customers. It provides a structured online marketplace to browse, subscribe to, and order daily or weekly tiffin services reliably.

## 🚀 Key Features

*   **Multi-Role Architecture:** Dedicated interfaces and workflows for three distinct user types: **Customers**, **Providers**, and **Admins**.
*   **Customer Journey:** Discover food providers, add multi-kitchen items to a single cart, place instant orders, and manage subscriptions.
*   **Provider Management:** Tiffin service providers can manage menus, track upcoming orders, receive payments (Razorpay integration), and gather customer feedback.
*   **Admin Dashboard:** Centralized control for user management, provider verification, payout processing, and overall platform monitoring.
*   **Real-time Order Tracking:** Background cron-jobs for cart management and real-time status updates on active orders.
*   **Recommendation & Feedback:** ML/Data tailored recommendations and a robust review/rating system for quality assurance.
*   **Secure Authentication:** OTP verification via Twilio/Nodemailer and secure session handling using JWT.

## 🛠️ Technology Stack

**Frontend:**
*   **React 19 (Vite):** Fast, modern UI development.
*   **Redux Toolkit & React-Redux:** Global state management.
*   **Tailwind CSS:** Utility-first responsive styling and beautiful layouts.
*   **React Router Dom:** Client-side routing.
*   **Framer Motion:** Smooth micro-animations and dynamic transitions.

**Backend:**
*   **Node.js & Express.js:** Scalable server-side infrastructure.
*   **MongoDB & Mongoose:** Flexible NoSQL database and ODM.
*   **JWT & bcryptjs:** Secure authentication and authorization.
*   **Razorpay:** Integrated payment gateway.
*   **Cloudinary / Multer:** Image upload and asset management.
*   **Node-Cron:** Task scheduling for cart expirations and routine jobs.

**DevOps & Infrastructure:**
*   **Docker & Docker Compose:** Containerized, reproducible deployment environment for the database, backend, and frontend.

## 📁 Project Structure

```
Tiffins-by-Naari/
│
├── Backend/               # Code for Express server, Mongoose models, Controllers
│   ├── src/
│   │   ├── config/        # Environment and DB config
│   │   ├── middlewares/   # JWT, Admin/Provider role checkers
│   │   ├── modules/       # Domain-driven feature modules (auth, order, tiffin, etc.)
│   │   └── utils/         # Helper functions
│   └── package.json       
│
├── Frontend/              # React/Vite web application
│   ├── src/
│   │   ├── pages/         # Core views (Admin, Customer, Provider, Home, Auth)
│   │   ├── components/    # Reusable UI widgets
│   │   ├── store/         # Redux slices and store configuration
│   │   └── services/      # API integrations (Axios config)
│   └── package.json
│
├── docker/                # Pre-configured Dockerfiles
└── docker-compose.yml     # Multi-container orchestration
```

## ⚙️ Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+ recommended)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas)
*   [Docker](https://www.docker.com/) (Optional, if using containers)

### 1. Using Docker (Recommended)
You can easily spin up the entire application using Docker Compose. Make sure you have a valid `.env` file in the `Backend` directory containing your keys (Mongo URI, JWT Secret, Razorpay Credentials, etc.).

```bash
# From the root directory, build and run the services
docker-compose up --build -d
```
*   **Frontend** will run on: `http://localhost` (or port 80)
*   **Backend** API will run on: `http://localhost:5000`
*   **MongoDB** will be available at: `localhost:27017`

### 2. Manual Setup (Local Development)

**Setting up the Backend:**
```bash
cd Backend
npm install
npm run dev # Starts the backend using nodemon on port 5000
```

**Setting up the Frontend:**
```bash
# In a new terminal
cd Frontend
npm install
npm run dev # Starts the Vite dev server
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit PRs.

## 👥 Contributors
A big thank you to the following contributors who have helped build this project:
- Charmi Bhayani
- Bhavika Mulani
- Kajal Varlani

## 📄 License
This project is licensed under the ISC License.
