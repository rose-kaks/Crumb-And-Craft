import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">FRESHLY BAKED • MADE WITH LOVE</p>

          <h1>
            Cakes made for
            <span> your sweetest moments.</span>
          </h1>

          <p className="hero-text">
            From elegant celebration cakes to completely custom creations,
            Crumb &amp; Craft makes every occasion a little sweeter.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate('/menu')}
            >
              Explore Our Cakes →
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate('/cakes/custom')}
            >
              Create Your Cake
            </button>
          </div>

          <div className="hero-features">
            <div>
              <strong>100%</strong>
              <span>Freshly baked</span>
            </div>

            <div>
              <strong>Egg &amp; Eggless</strong>
              <span>Options available</span>
            </div>

            <div>
              <strong>Custom</strong>
              <span>Made for you</span>
            </div>
          </div>
        </div>

        {/* Cake Visual */}
        <div className="cake-visual">
          <div className="cake-glow"></div>

          <div className="cake">
            <div className="cake-top">
              <div className="cake-decoration">✦</div>
              <div className="candle"></div>
              <div className="candle-flame"></div>
            </div>

            <div className="cake-layer layer-one"></div>
            <div className="cake-layer layer-two"></div>
            <div className="cake-layer layer-three"></div>
          </div>

          <div className="floating-card card-one">
            <span>♡</span>
            <div>
              <strong>Made with love</strong>
              <small>Every single order</small>
            </div>
          </div>

          <div className="floating-card card-two">
            <span>★</span>
            <div>
              <strong>Custom cakes</strong>
              <small>Your design, our craft</small>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="section-heading">
          <p className="eyebrow">WHAT ARE YOU CRAVING?</p>
          <h2>Find your perfect cake</h2>
          <p>
            Something for birthdays, celebrations, or simply because
            today deserves cake.
          </p>
        </div>

        <div className="category-grid">
          <CategoryCard
            icon="🍫"
            title="Chocolate"
            description="Rich, indulgent &amp; irresistible"
            onClick={() => navigate('/menu')}
          />

          <CategoryCard
            icon="🍓"
            title="Red Velvet"
            description="Soft, creamy &amp; classic"
            onClick={() => navigate('/menu')}
          />

          <CategoryCard
            icon="🍰"
            title="Celebration"
            description="Made for your special moments"
            onClick={() => navigate('/menu')}
          />

          <CategoryCard
            icon="✨"
            title="Custom Cakes"
            description="Dream it. We'll bake it."
            onClick={() => navigate('/cakes/custom')}
          />
        </div>
      </section>

      {/* Why us */}
      <section className="why-us">
        <div>
          <p className="eyebrow">WHY CRUMB &amp; CRAFT?</p>
          <h2>Not just a cake.<br />A little memory.</h2>
        </div>

        <div className="benefits">
          <div className="benefit">
            <div className="benefit-icon">🥣</div>
            <div>
              <h3>Freshly baked</h3>
              <p>Every cake is prepared fresh for your order.</p>
            </div>
          </div>

          <div className="benefit">
            <div className="benefit-icon">🎨</div>
            <div>
              <h3>Your way</h3>
              <p>Choose flavours, messages, eggless options and more.</p>
            </div>
          </div>

          <div className="benefit">
            <div className="benefit-icon">📅</div>
            <div>
              <h3>Plan ahead</h3>
              <p>Schedule your delivery or pickup for the perfect day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bottom-cta">
        <p className="eyebrow">READY TO MAKE IT SWEET?</p>

        <h2>Your next celebration starts here.</h2>

        <button
          className="primary-btn"
          onClick={() => navigate('/menu')}
        >
          Browse Cake Menu →
        </button>
      </section>

    </div>
  );
}

function CategoryCard({ icon, title, description, onClick }) {
  return (
    <button className="category-card" onClick={onClick}>
      <div className="category-icon">{icon}</div>

      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <span className="arrow">→</span>
    </button>
  );
}