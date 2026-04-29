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

### Key AI Prompts Used During Development

Below are the core prompts used to guide the AI during the development of this project:

#### 1. Backend Setup
> *"Create a Flask-based backend for a Laundry Order Management System. Requirements: Build a POST /orders API, accept JSON input (customerName, phone, items), use a price dictionary (Shirt, Pants, Saree), calculate total bill automatically, generate a unique orderId, store orders in memory, and return orderId and totalAmount."*

#### 2. Order Status Management
> *"Extend the Flask app to support order status updates. Requirements: Add PUT /orders/<id>/status endpoint, accept status in request body, allowed statuses: RECEIVED, PROCESSING, READY, DELIVERED, update order by ID, and handle invalid IDs with proper error responses."*

#### 3. Order Filtering
> *"Update GET /orders API to support filtering. Requirements: Return all orders by default, support query params (status, customerName, phone), implement filtering logic with partial matching for customer name, and keep logic simple and readable."*

#### 4. Dashboard API
> *"Create a GET /dashboard API. Requirements: Return total orders, total revenue, and count of orders per status using in-memory data, returning a clean JSON response."*

#### 5. Frontend Integration
> *"Create a simple HTML frontend for the Flask backend. Requirements: Form to create orders, buttons to fetch all orders and dashboard data, use JavaScript fetch API to display responses on the page, and keep the UI minimal with basic CSS."*

#### 6. Code Improvement & Bug Fixing
> *"Review and improve the Flask application. Requirements: Add input validation for missing fields/invalid values, fix filtering issues, improve code readability, remove redundant logic, and ensure all APIs work correctly."*

#### 7. Estimated Delivery Feature
> *"Add an estimated delivery date to orders. Requirements: Set delivery date = current date + 2 days, store it in the order object, return it in the API response, and use the Python datetime module."*

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
