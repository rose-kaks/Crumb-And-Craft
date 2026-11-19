
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import './OrdersPage.css';

const DEMO_USER_ID = '674a1f000000000000000001';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/orders/user/${DEMO_USER_ID}`)
      .then(response => setOrders(response.data))
      .catch(() => setError('Unable to fetch your orders.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="orders-page">
      <div className="orders-heading">
        <p className="eyebrow">YOUR BAKERY JOURNEY</p>
        <h1>My Pre-Orders</h1>
        <p>Keep track of your sweetest creations.</p>
      </div>

      {location.state?.success && (
        <div className="order-success">
          <h3>{location.state.success}</h3>
          <p>Order ID: {location.state.orderId}</p>
        </div>
      )}

      {loading && <p>Loading orders...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="no-orders">
          <h2>No orders yet!</h2>
          <p>Your next celebration starts with a cake.</p>
          <button onClick={() => navigate('/menu')}>
            Explore Cakes
          </button>
        </div>
      )}

      <div className="orders-list">
        {orders.map(order => (
          <article className="order-card" key={order._id}>
            <div className="order-card-header">
              <div>
                <span>ORDER ID</span>
                <h3>{order._id}</h3>
              </div>

              <span className="order-status">
                {order.orderStatus}
              </span>
            </div>

            {order.items.map((item, index) => (
              <div className="ordered-product" key={index}>
                <div>
                  <h4>{item.title}</h4>
                  <p>
                    Quantity: {item.quantity} ·
                    {item.isEggless ? ' Eggless' : ' Regular'}
                  </p>
                  {item.cakeMessage && (
                    <p>Inscription: {item.cakeMessage}</p>
                  )}
                  <p>
                    Delivery date:{' '}
                    {new Date(item.deliveryDate).toLocaleDateString('en-IN')}
                  </p>
                </div>

                <strong>
                  ₹{item.unitPrice * item.quantity}
                </strong>
              </div>
            ))}

            <div className="order-footer">
              <span>
                {order.fulfillmentType}
                {order.couponApplied &&
                  ` · Coupon ${order.couponApplied}`}
              </span>

              <strong>
                Total: ₹{order.totalPayable.toLocaleString('en-IN')}
              </strong>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
