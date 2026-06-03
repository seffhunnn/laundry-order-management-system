# 🫧 BubbleStream | Laundry Order Management System

BubbleStream is a lightweight, modern, and high-performance full-stack laundry order management system designed to streamline internal laundry counter operations. It features dynamic order creation, live cost estimation, interactive operational status tracking, search filters, and an operational dashboard for real-time business metrics.

Built with a clean separation of concerns, the project couples a robust **Node.js, Express, and MongoDB backend** with a highly responsive, glassmorphic **vanilla HTML/CSS/JavaScript client**.

---

## 📂 Project Architecture

```text
laundry-order-management-system/
│
├── backend/
│   ├── config/
│   │   └── db.js          # Mongoose database connection client
│   ├── models/
│   │   └── order.js       # Order Schema definition and pricing models
│   ├── routes/
│   │   └── orderRoutes.js # REST API handlers (CRUD & dashboard aggregates)
│   ├── .env.example       # Template for required environment variables
│   ├── package.json       # Backend script definitions and package dependencies
│   └── server.js          # Express app entry point
│
├── frontend/
│   ├── index.html         # User Interface structure (Premium Outfit typography)
│   ├── style.css          # Design system styles (Glassmorphism & animations)
│   └── script.js          # Frontend fetches, UI updates, and cost calculations
│
├── .gitignore             # Strict version control exclusion rules
└── README.md              # Project instructions and documentation
```

---

## ⚡ Quick Start & Installation

Follow these steps to set up the application locally:

### 1. Prerequisites
Ensure you have the following installed on your system:
* **Node.js** (v16.0.0 or higher)
* **npm** (v8.0.0 or higher)
* **MongoDB** (Local instance or MongoDB Atlas cloud cluster)

---

### 2. Backend Setup
1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   * Copy the template `.env.example` file to create your active `.env` configuration:
     ```bash
     cp .env.example .env
     ```
   * Open the newly created `.env` file and configure your local or remote MongoDB connection URI:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://127.0.0.1:27017/laundry_db
     ```
     > [!IMPORTANT]
     > Never commit your `.env` file to version control. The project's `.gitignore` has been updated to automatically block environment configurations.

---

### 3. Running the Server

* **Standard Start**:
  ```bash
  npm start
  ```
* **Development Mode** (Recommended - enables auto-reload on changes via nodemon):
  ```bash
  npm run dev
  ```

---

### 4. Accessing the Application
Once the server starts successfully, open your browser and navigate to:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

The Express backend is configured to statically serve the frontend assets, establishing a seamless local host interface.

---

## 🌟 Key Features

* 📝 **Create Laundry Orders**: Capture customer name, phone number, select garment types (Shirt, Pants, Saree), and specify quantities.
* 💰 **Live Cost Estimator**: Pre-calculates and displays the estimated total cost dynamically in real-time as users modify orders before final submission.
* 📊 **Operational Dashboard**: Real-time aggregated statistics tracking total order volume, overall revenue (INR), and order counts grouped by status.
* 🚦 **Status Lifecycle Workflows**: Transition orders through progressive stages: `RECEIVED` ➔ `PROCESSING` ➔ `READY` ➔ `DELIVERED`.
* 🔍 **Granular Filters**: Real-time search capability filtering orders dynamically by status tags, customer names (case-insensitive), or phone matches.
* 🎨 **Premium UI/UX Design**: Built with a sleek dark-themed glassmorphism aesthetic, custom Outfit typography, dynamic CSS animations, and full responsiveness across mobile and desktop.

---

## 🔌 API Reference

### Orders Management

#### 1. Create a New Order
* **Endpoint**: `POST /orders`
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "customerName": "Alice Vance",
    "phone": "9876543210",
    "items": [
      {
        "type": "Shirt",
        "quantity": 3
      }
    ]
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "_id": "603f75d5b7a70a00155b9e5a",
    "orderId": 12,
    "customerName": "Alice Vance",
    "phone": "9876543210",
    "items": [{ "type": "Shirt", "quantity": 3, "price": 20 }],
    "totalAmount": 60,
    "status": "RECEIVED",
    "estimatedDeliveryDate": "2026-06-06",
    "createdAt": "2026-06-04T12:00:00.000Z"
  }
  ```

#### 2. Get All Orders (With Filters)
* **Endpoint**: `GET /orders`
* **Query Parameters** (Optional):
  * `status` (e.g., `PROCESSING`)
  * `customerName` (substring search)
  * `phone` (substring search)
* **Success Response (200 OK)**:
  ```json
  [
    {
      "orderId": 12,
      "customerName": "Alice Vance",
      "phone": "9876543210",
      "items": [{ "type": "Shirt", "quantity": 3, "price": 20 }],
      "totalAmount": 60,
      "status": "RECEIVED",
      "estimatedDeliveryDate": "2026-06-06"
    }
  ]
  ```

#### 3. Update Order Status
* **Endpoint**: `PUT /orders/:id/status`
* **URL Parameter**: `:id` (Can be the sequential integer `orderId` or the MongoDB standard `_id`)
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "status": "PROCESSING"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "orderId": 12,
    "newStatus": "PROCESSING",
    "message": "Order status updated successfully"
  }
  ```

---

### Dashboard Metrics

#### 1. Retrieve Operational Metrics
* **Endpoint**: `GET /dashboard`
* **Success Response (200 OK)**:
  ```json
  {
    "totalOrders": 12,
    "totalRevenue": 240,
    "statusCounts": {
      "RECEIVED": 2,
      "PROCESSING": 4,
      "READY": 5,
      "DELIVERED": 1
    }
  }
  ```

---

## 🛠️ Tech Stack

* **Frontend**: Vanilla HTML5, CSS3 Custom Properties (Variables), Vanilla JavaScript (ES6+), Google Fonts.
* **Backend**: Node.js, Express framework.
* **Database**: MongoDB, Mongoose ODM.
* **Security & Environments**: Dotenv, custom `.gitignore` exclusions.
