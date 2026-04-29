# Laundry Order Management System

This is a simple web-based system designed to help a dry cleaning store manage daily laundry orders efficiently. It handles everything from taking an order and calculating the bill to tracking the status and showing a basic analytics dashboard.  

The backend is built using Flask, and a lightweight frontend is created using HTML, CSS, and JavaScript.

---

## How to Run it

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
2. **Run the server**:
   ```bash
   python app.py
   ```
3. **Open in browser**:
   Go to `http://127.0.0.1:5000/`

---

## Features

- **Create laundry orders**: Add orders with customer details and items.
- **Automatic billing**: Bill calculation based on item types (Shirt, Pants, Saree).
- **Status tracking**: Move orders through stages (RECEIVED → PROCESSING → READY → DELIVERED).
- **Filtering**: Filter orders by status, name, or phone number.
- **Dashboard**: View total orders, revenue, and status breakdowns at a glance.
- **Estimated delivery**: Auto-calculated delivery date (+2 days from order creation).
- **Simple UI**: A clean, responsive frontend to interact with the system.

---

## API Endpoints

- `POST /orders` → Create a new order.
- `GET /orders` → Get all orders (supports filters via query params).
- `PUT /orders/<id>/status` → Update an existing order's status.
- `GET /dashboard` → Get summary stats and revenue data.

---

## AI Usage Report

This project was built using an AI-first approach, leveraging AI tools to accelerate development while ensuring manual oversight for code quality and logic.

### Tools Used
- **ChatGPT**
- **Antigravity IDE** (Gemini-powered)

### Sample Prompts Used
- *"Create a Flask POST /orders API that accepts customer details, calculates total bill using a price dictionary, and stores orders in memory."*
- *"Add filtering support in GET /orders API using query parameters like status, name, and phone."*
- *"Create a dashboard API that calculates total revenue, total orders, and count of orders by status."*
- *"Fix issues in Flask API where filtering is not working correctly and simplify the logic."*
- *"Generate a simple HTML frontend that interacts with Flask APIs using fetch and displays responses."*

### Where AI Helped
- Quickly setting up the Flask project structure and routing.
- Generating the core logic for CRUD APIs (orders, status updates, dashboard).
- Writing the frontend `fetch` logic to connect the UI with the backend.
- Providing initial implementations for filtering and billing calculations.

### What AI Got Wrong
- **No Input Validation**: Initially allowed empty fields, invalid data, or incorrect item types.
- **Messy Code Structure**: Logic was placed directly inside routes, making it harder to maintain as the project grew.
- **Filtering Bugs**: Query filtering didn’t handle partial name matches properly at first.
- **No Handling of Edge Cases**: Missing checks for invalid order IDs or incorrect status values.

### What I Improved
- **Added Input Validation**: Implemented strict checks for required fields, valid quantities, and correct item types.
- **Code Refactoring**: Cleaned up the logic and organized it into helper functions for better readability.
- **Fixed Filtering Logic**: Updated the GET API to properly support partial matches and case-insensitive searches.
- **Improved Error Handling**: Added proper error responses for invalid IDs, missing data, and edge cases.
- **New Feature**: Added the **Estimated Delivery Date** logic (+2 days from creation).
- **UI Connectivity**: Manually integrated the backend APIs with a working, styled frontend UI.

---

## Tradeoffs

- **In-memory storage**: Data is stored in a Python list, so it resets whenever the server restarts.
- **No authentication**: The system is open and does not include login or user roles.
- **Minimal UI**: The frontend is intentionally kept simple to focus on core backend functionality.

---

## Future Improvements

- **Database Integration**: Add MongoDB or SQLite for data persistence.
- **Authentication**: Implement a login system for staff members.
- **UI Enhancement**: Use a modern framework like React or Tailwind CSS.
- **Advanced Search**: Add search by garment type or specific items.
- **Notifications**: Add SMS or Email alerts for order readiness.

---

## Demo
- Screenshots of the dashboard and order list are included in the screenshots folder.
- APIs can be fully tested using tools like Postman.
- The frontend UI is available at `localhost` once the server is running.
- A Postman collection is included (or can be provided) to test all endpoints.
