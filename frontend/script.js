// API Base Address
// If running on a local dev server (e.g. live-server on port 8080), fallback to backend at port 5000.
// If served by the backend or in production, use the current origin.
const API_BASE = (
  (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') && 
  window.location.port !== '5000'
) 
  ? 'http://127.0.0.1:5000' 
  : (window.location.origin.startsWith('http') ? window.location.origin : 'http://127.0.0.1:5000');


// Pricing Configuration to calculate live cost preview
const PRICE_LIST = {
    "Shirt": 20,
    "Pants": 30,
    "Saree": 50
};

// UI Notification Helper
const notify = (id, message, isError = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    
    el.innerText = message;
    el.className = `notification-box ${isError ? 'error' : 'success'}`;
    
    // Smooth fade in
    el.style.display = 'block';
    
    // Clear notification after 4 seconds
    setTimeout(() => {
        el.style.display = 'none';
    }, 4000);
};

// 1. Live Cost Estimator
const updateCostPreview = () => {
    const itemType = document.getElementById('itemType').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    const pricePerUnit = PRICE_LIST[itemType] || 0;
    const estimatedTotal = pricePerUnit * quantity;
    
    document.getElementById('estimatedCost').innerText = `₹${estimatedTotal}`;
};

// Event Listeners for live estimation
document.getElementById('itemType').addEventListener('change', updateCostPreview);
document.getElementById('quantity').addEventListener('input', updateCostPreview);

// 2. Submit: Create Order Form
document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const customerName = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const type = document.getElementById('itemType').value;
    const quantity = parseInt(document.getElementById('quantity').value);

    const payload = {
        customerName,
        phone,
        address,
        items: [{ type, quantity }]
    };

    try {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            notify(
                'orderResponse', 
                `Success! Order #${data.orderId} created. Total: ₹${data.totalAmount}. Expected Delivery: ${data.estimatedDeliveryDate}`,
                false
            );
            
            // Reset form and update cost preview
            document.getElementById('orderForm').reset();
            updateCostPreview();
            
            // Reload components
            loadDashboard();
            loadOrders();
        } else {
            notify('orderResponse', data.error || 'Failed to create order', true);
        }
    } catch (err) {
        console.error('Error submitting order:', err);
        notify('orderResponse', 'Network connection error. Please try again.', true);
    }
});

// 3. Submit: Update Status Form
document.getElementById('statusForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const orderId = document.getElementById('updateOrderId').value;
    const status = document.getElementById('updateStatus').value;

    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Order #${data.orderId} status successfully updated to ${data.newStatus}`);
            
            // Reset update status form fields
            document.getElementById('statusForm').reset();
            
            // Reload components
            loadDashboard();
            loadOrders();
        } else {
            alert(`Error: ${data.error || 'Failed to update order status'}`);
        }
    } catch (err) {
        console.error('Error updating status:', err);
        alert('Network connection error. Failed to update status.');
    }
});

// 4. Load & Render Orders List (with filters)
async function loadOrders() {
    const statusVal = document.getElementById('filterStatus').value;
    const nameVal = document.getElementById('filterName').value.trim();
    const phoneVal = document.getElementById('filterPhone').value.trim();

    // Construct URL search query parameters
    const params = new URLSearchParams();
    if (statusVal) params.append('status', statusVal);
    if (nameVal) params.append('customerName', nameVal);
    if (phoneVal) params.append('phone', phoneVal);

    const container = document.getElementById('ordersContainer');
    const countBadge = document.getElementById('ordersCountBadge');

    try {
        const response = await fetch(`${API_BASE}/orders?${params.toString()}`);
        const orders = await response.json();

        if (!response.ok) {
            throw new Error(orders.error || 'Could not load orders');
        }

        // Update list badge count
        countBadge.innerText = `${orders.length} Order${orders.length !== 1 ? 's' : ''}`;

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p>No orders found matching the filter query.</p>
                </div>
            `;
            return;
        }

        // Generate and render order list cards
        container.innerHTML = '';
        orders.forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-card';
            
            // Format item details
            const itemsString = order.items.map(item => `${item.quantity}x ${item.type}`).join(', ');

            card.innerHTML = `
                <div class="order-card-col">
                    <div>
                        <span class="order-id-label">ORDER #${order.orderId}</span>
                        <h3 class="order-customer-name">${order.customerName}</h3>
                    </div>
                    <div class="order-contact-details">
                        <span class="order-phone">📞 ${order.phone}</span>
                        <span class="order-address" title="${order.address || ''}">📍 ${order.address || 'N/A'}</span>
                    </div>
                </div>
                <div class="order-card-col">
                    <span class="status-badge status-${order.status}">${order.status}</span>
                    <span class="delivery-date">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        ${order.estimatedDeliveryDate}
                    </span>
                </div>
                <div class="order-card-col order-cost-col">
                    <span class="order-amount">₹${order.totalAmount}</span>
                    <span class="order-items-list" title="${itemsString}">${itemsString}</span>
                    <button class="btn-delete" onclick="deleteOrder('${order.orderId}')" title="Delete Order">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error('Error fetching orders:', err);
        container.innerHTML = `
            <div class="empty-state">
                <p style="color: #ef4444;">Error connecting to server. Failed to fetch laundry records.</p>
            </div>
        `;
    }
}

// Delete Order from client
window.deleteOrder = async function(orderId) {
    if (!confirm(`Are you sure you want to delete Order #${orderId}?`)) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (response.ok) {
            loadDashboard();
            loadOrders();
        } else {
            alert(`Error: ${data.error || 'Failed to delete order'}`);
        }
    } catch (err) {
        console.error('Error deleting order:', err);
        alert('Network connection error. Failed to delete order.');
    }
};

// 5. Load & Update Dashboard Statistics
async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE}/dashboard`);
        const data = await response.json();

        if (response.ok) {
            document.getElementById('statTotalOrders').innerText = data.totalOrders;
            document.getElementById('statRevenue').innerText = `₹${data.totalRevenue}`;
            document.getElementById('statReceived').innerText = data.statusCounts.RECEIVED;
            document.getElementById('statProcessing').innerText = data.statusCounts.PROCESSING;
            document.getElementById('statReady').innerText = data.statusCounts.READY;
            document.getElementById('statDelivered').innerText = data.statusCounts.DELIVERED;
        }
    } catch (err) {
        console.error('Error loading dashboard:', err);
    }
}

// Initial page loading
window.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    loadOrders();
    updateCostPreview();
});
