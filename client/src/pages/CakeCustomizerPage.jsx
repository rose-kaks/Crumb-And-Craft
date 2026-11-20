
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './CakeCustomizerPage.css';
import { useCart } from '../context/useCart';

const APP_START_TIME = Date.now();

export default function CakeCustomizerPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [cake, setCake] = useState(null);
  const [message, setMessage] = useState('');
  const [eggless, setEggless] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(response => setCake(response.data))
      .catch(() => setError('Unable to find this cake.'));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!cake) return <p>Loading cake...</p>;

  
  const addToCart = () => {
    setError('');

    if (message.length > 60) {
      return setError('Message cannot exceed 60 characters.');
    }

    if (!deliveryDate) {
      return setError('Please select a delivery date.');
    }

    if (eggless && !cake.supportsEggless) {
      return setError('Eggless option is unavailable.');
    }

    const selectedDate = new Date(`${deliveryDate}T00:00:00`);
    const minimumDate = new Date();

    minimumDate.setHours(0, 0, 0, 0);
    minimumDate.setHours(
      minimumDate.getHours() + cake.prepLeadHours
    );

    if (selectedDate <= minimumDate) {
      return setError(
        `Please select a date at least ${cake.prepLeadHours} hours ahead.`
      );
    }

    addItem({
      productId: cake._id,
      title: cake.title,
      price: cake.price,
      quantity,
      cakeMessage: message.trim(),
      isEggless: eggless,
      deliveryDate
    });

    navigate('/cart');
  };


  return (
    <main className="customizer-page">
      <div className="customizer-card">
        <img src={cake.imageUrl} alt={cake.title} />

        <div className="customizer-details">
          <p className="eyebrow">MAKE IT YOUR OWN</p>

          <h1>{cake.title}</h1>

          <p>{cake.flavor} · {cake.weightKg} kg</p>

          <h2>₹{cake.price.toLocaleString('en-IN')}</h2>

          <label>
            Message on Cake
            <input
              maxLength={60}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Happy Birthday!"
            />
            <small>{message.length}/60 characters</small>
          </label>

          <label>
            <input
              type="checkbox"
              checked={eggless}
              disabled={!cake.supportsEggless}
              onChange={e => setEggless(e.target.checked)}
            />
            Eggless Cake
          </label>

          <label>
            Quantity
            <input
              type="number"
              min="1"
              max="20"
              value={quantity}
              onChange={e => setQuantity(
                Math.min(20, Math.max(1, Number(e.target.value) || 1))
              )}
            />
          </label>

          <label>
            Delivery / Pickup Date
            <input
              type="date"
              min={new Date(
                APP_START_TIME + cake.prepLeadHours * 3600000
              ).toLocaleDateString('en-CA')}
              value={deliveryDate}
              onChange={e => setDeliveryDate(e.target.value)}
            />
          </label>

          {error && <p className="customizer-error">{error}</p>}

          <button onClick={addToCart}>
            Add to Cart — ₹{(cake.price * quantity).toLocaleString('en-IN')}
          </button>
        </div>
      </div>
    </main>
  );
}
