from flask import Flask, request, jsonify, render_template
from datetime import datetime, timedelta

app = Flask(__name__)

# --- Configuration & Constants ---
VALID_STATUSES = ["RECEIVED", "PROCESSING", "READY", "DELIVERED"]
PRICE_LIST = {
    "Shirt": 20,
    "Pants": 30,
    "Saree": 50
}

# --- In-memory Storage ---
orders = []
order_id_counter = 1

# --- Helper Functions ---

def calculate_total(items):
    """Calculates the total amount for a list of items based on the price list."""
    total = 0
    for item in items:
        item_type = item.get('type')
        quantity = item.get('quantity', 0)
        price = PRICE_LIST.get(item_type, 0)
        total += price * quantity
    return total

def validate_order_data(data):
    """Validates the incoming JSON data for creating an order."""
    if not data:
        return "No data provided"
    
    required_fields = ['customerName', 'phone', 'items']
    for field in required_fields:
        if field not in data or not data[field]:
            return f"Missing required field: {field}"
    
    if not isinstance(data['items'], list) or len(data['items']) == 0:
        return "Items must be a non-empty list"
    
    for item in data['items']:
        if 'type' not in item or 'quantity' not in item:
            return "Each item must have a type and quantity"
        if item['type'] not in PRICE_LIST:
            return f"Invalid item type: {item['type']}"
        if not isinstance(item['quantity'], int) or item['quantity'] <= 0:
            return "Quantity must be a positive integer"
            
    return None

# --- API Routes ---

@app.route('/')
def home():
    """Serves the frontend dashboard."""
    return render_template("index.html")

@app.route('/orders', methods=['POST'])
def create_order():
    """Creates a new laundry order."""
    global order_id_counter
    
    data = request.get_json()
    error = validate_order_data(data)
    if error:
        return jsonify({"error": error}), 400
        
    total_amount = calculate_total(data['items'])
    
    # Calculate estimated delivery date (current date + 2 days)
    delivery_date = datetime.now() + timedelta(days=2)
    estimated_delivery = delivery_date.strftime("%Y-%m-%d")
        
    new_order = {
        "orderId": order_id_counter,
        "customerName": data['customerName'],
        "phone": data['phone'],
        "items": data['items'],
        "totalAmount": total_amount,
        "status": "RECEIVED",
        "estimatedDeliveryDate": estimated_delivery
    }
    
    orders.append(new_order)
    order_id_counter += 1
    
    return jsonify({
        "message": "Order created successfully",
        "orderId": new_order['orderId'],
        "totalAmount": total_amount,
        "estimatedDeliveryDate": estimated_delivery,
        "currency": "INR"
    }), 201

@app.route('/orders', methods=['GET'])
def get_orders():
    """Retrieves all orders with optional filtering."""
    status_filter = request.args.get('status')
    name_filter = request.args.get('customerName')
    phone_filter = request.args.get('phone')
    
    filtered_orders = orders
    
    if status_filter:
        filtered_orders = [o for o in filtered_orders if o['status'] == status_filter]
    
    if name_filter:
        filtered_orders = [o for o in filtered_orders if name_filter.lower() in o['customerName'].lower()]
        
    if phone_filter:
        filtered_orders = [o for o in filtered_orders if o['phone'] == phone_filter]
        
    return jsonify(filtered_orders), 200

@app.route('/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Updates the status of an existing order."""
    data = request.get_json()
    if not data or 'status' not in data:
        return jsonify({"error": "Status field is required"}), 400
        
    new_status = data['status']
    if new_status not in VALID_STATUSES:
        return jsonify({"error": f"Invalid status. Valid: {', '.join(VALID_STATUSES)}"}), 400
    
    for order in orders:
        if order['orderId'] == order_id:
            order['status'] = new_status
            return jsonify({
                "message": "Status updated successfully",
                "orderId": order_id,
                "newStatus": new_status
            }), 200
            
    return jsonify({"error": "Order not found"}), 404

@app.route('/dashboard', methods=['GET'])
def get_dashboard():
    """Returns summarized metrics for the dashboard."""
    total_orders = len(orders)
    total_revenue = sum(o['totalAmount'] for o in orders)
    
    status_counts = {status: 0 for status in VALID_STATUSES}
    for o in orders:
        status = o['status']
        if status in status_counts:
            status_counts[status] += 1
            
    return jsonify({
        "totalOrders": total_orders,
        "totalRevenue": total_revenue,
        "statusCounts": status_counts,
        "currency": "INR"
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
