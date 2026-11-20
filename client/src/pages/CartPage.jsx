
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/useCart';
import { getCustomizationKey } from '../context/cartReducer';
import { useAuth } from '../context/auth';
import './CartPage.css';

export default function CartPage() {
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [fulfillment, setFulfillment] = useState('Delivery');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    cart,
    subtotal,
    removeItem,
    updateQuantity,
    clearCart
  } = useCart();

  // Read authentication context only once.
  const { user, loading: authLoading } = useAuth();

  const total = subtotal - discount;

  // APPLY COUPON
  const applyCoupon = async () => {
    setMessage('');

    if (!coupon.trim()) {
      return setMessage('Please enter a coupon code.');
    }

    try {
      const response = await api.post('/offers/validate', {
        code: coupon,
        orderValue: subtotal
      });

      setDiscount(response.data.discountAmount);
      setAppliedCoupon(response.data.code);
      setMessage(response.data.message);
    } catch (error) {
      setDiscount(0);
      setAppliedCoupon('');

      setMessage(
        error.response?.data?.message || 'Unable to validate coupon.'
      );
    }
  };

  // PLACE PRE-ORDER
  const placeOrder = async () => {
    setMessage('');

    if (authLoading) {
      return setMessage('Please wait while your login is being verified.');
    }

    if (cart.length === 0) {
      return setMessage('Your cart is empty.');
    }

    if (
      fulfillment === 'Delivery' &&
      (!street.trim() ||
        !city.trim() ||
        !postalCode.trim() ||
        !phone.trim())
    ) {
      return setMessage('Please complete your delivery address.');
    }

    if (
      fulfillment === 'Delivery' &&
      !/^[0-9]{10}$/.test(phone)
    ) {
      return setMessage('Enter a valid 10-digit phone number.');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (cart.some(item => new Date(item.deliveryDate) <= today)) {
      return setMessage('Please select a future delivery date.');
    }

    // Backend publicUser() returns id, not _id.
    const authenticatedUserId = user?.id;

    if (!authenticatedUserId) {
      return setMessage('Please log in before placing an order.');
    }

    setLoading(true);

    try {
      const response = await api.post('/orders/pre-order', {
        userId: authenticatedUserId,

        fulfillmentType: fulfillment,

        couponCode: appliedCoupon || null,

        shippingAddress:
          fulfillment === 'Delivery'
            ? {
                street,
                city,
                postalCode,
                phone
              }
            : undefined,

        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          cakeMessage: item.cakeMessage,
          isEggless: item.isEggless,
          deliveryDate: item.deliveryDate
        }))
      });

      clearCart();

      navigate('/orders', {
        state: {
          success: response.data.message,
          orderId: response.data.order._id
        }
      });

    } catch (error) {
      console.error(
        'Pre-order error:',
        error.response?.data || error
      );

      setMessage(
        error.response?.data?.message || 'Order could not be placed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <p className="eyebrow">YOUR SWEET SELECTION</p>
        <h1>Shopping Cart</h1>
      </div>

      <div className="cart-layout">

        <section className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <h2>Your cart is waiting for something sweet!</h2>
              <button onClick={() => navigate('/menu')}>
                Explore Cakes
              </button>
            </div>
          ) : (
            cart.map(item => {
              const itemKey = getCustomizationKey(item);

              return (
                <article className="cart-item" key={itemKey}>
                  <div>
                    <h3>{item.title}</h3>

                    <p>
                      {item.quantity} × ₹{item.price}
                    </p>

                    <p>
                      {item.isEggless ? 'Eggless' : 'Regular'} ·
                      {item.deliveryDate}
                    </p>

                    {item.cakeMessage && (
                      <p>Message: {item.cakeMessage}</p>
                    )}
                  </div>

                  <div className="cart-item-actions">
                    <strong>
                      ₹{(
                        item.price * item.quantity
                      ).toLocaleString('en-IN')}
                    </strong>

                    <div>
                      <button
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          updateQuantity(itemKey, item.quantity - 1)
                        }
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        disabled={item.quantity >= 20}
                        onClick={() =>
                          updateQuantity(itemKey, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button onClick={() => removeItem(itemKey)}>
                      Remove
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {cart.length > 0 && (
          <aside className="order-summary">
            <h2>Order Summary</h2>

            <div className="coupon-box">
              <input
                placeholder="Enter coupon code"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
              />

              <button onClick={applyCoupon}>
                Apply
              </button>
            </div>

            {appliedCoupon && (
              <p className="coupon-success">
                Applied: {appliedCoupon}
              </p>
            )}

            <div className="summary-line">
              <span>Subtotal</span>
              <strong>₹{subtotal}</strong>
            </div>

            <div className="summary-line">
              <span>Discount</span>
              <strong>- ₹{discount}</strong>
            </div>

            <div className="summary-line grand-total">
              <span>Total</span>
              <strong>₹{total}</strong>
            </div>

            <h3>Fulfillment Method</h3>

            <select
              value={fulfillment}
              onChange={e => setFulfillment(e.target.value)}
            >
              <option value="Delivery">Home Delivery</option>
              <option value="Store Pickup">Store Pickup</option>
            </select>

            {fulfillment === 'Delivery' && (
              <div className="address-fields">
                <h3>Delivery Address</h3>

                <input
                  placeholder="Street address"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                />

                <input
                  placeholder="City"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                />

                <input
                  placeholder="Postal code"
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                />

                <input
                  placeholder="10-digit phone number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            )}

            {message && (
              <p className="cart-message">{message}</p>
            )}

            <button
              className="place-order-btn"
              disabled={loading || authLoading}
              onClick={placeOrder}
            >
              {authLoading
                ? 'Verifying Login...'
                : loading
                  ? 'Placing Order...'
                  : 'Place Pre-Order'}
            </button>
          </aside>
        )}

      </div>
    </main>
  );
}
