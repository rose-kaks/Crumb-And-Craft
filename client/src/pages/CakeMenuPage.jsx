
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './CakeMenuPage.css';

export default function CakeMenuPage() {
  const [cakes, setCakes] = useState([]);
  const [flavor, setFlavor] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const response = await api.get('/products');
        setCakes(response.data.products || []);
      } catch {
        setError('Unable to load cakes. Please check the backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchCakes();
  }, []);

  const flavors = [
    'All',
    'Chocolate',
    'Red Velvet',
    'Strawberry',
    'Vanilla'
  ];

  const filteredCakes = flavor === 'All'
    ? cakes
    : cakes.filter(cake => cake.flavor === flavor);

  return (
    <main className="menu-page">
      <section className="menu-heading">
        <p className="eyebrow">BAKED WITH LOVE</p>
        <h1>Our Cake Collection</h1>
        <p>Every celebration deserves something delicious.</p>
      </section>

      <div className="flavor-filters">
        {flavors.map(item => (
          <button
            key={item}
            className={flavor === item ? 'filter active' : 'filter'}
            onClick={() => setFlavor(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {loading && <p className="menu-message">Loading cakes...</p>}

      {error && <p className="menu-error">{error}</p>}

      {!loading && !error && filteredCakes.length === 0 && (
        <p className="menu-message">No cakes found.</p>
      )}

      <div className="cake-grid">
        {filteredCakes.map(cake => (
          <article className="cake-card" key={cake._id}>
            <img
              src={cake.imageUrl}
              alt={cake.title}
            />

            <div className="cake-card-content">
              <span className="cake-flavor">{cake.flavor}</span>

              <h2>{cake.title}</h2>

              <p>
                {cake.weightKg} kg ·
                {cake.supportsEggless
                  ? ' Eggless available'
                  : ' Regular only'}
              </p>

              <div className="cake-card-bottom">
                <strong>₹{cake.price.toLocaleString('en-IN')}</strong>

                <button
                  onClick={() => navigate(`/cakes/${cake._id}`)}
                >
                  Customize →
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
