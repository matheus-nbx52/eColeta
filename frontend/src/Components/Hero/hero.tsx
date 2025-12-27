import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Conectando você à coleta sustentável!</h1>
          <p>Facilitando a reciclagem e promovendo um futuro mais verde, juntos.</p>
          <button className="btn-saiba-mais">Saiba mais</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;