import React from 'react';
import homeImage from '../images/kenny-eliason-2K_-PG95qlI-unsplash.jpg';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Witamy w Januszex!</h1>
      <p className="text-xl mb-4">Najlepszy serwis samochodowy w mieście</p>
      <img
        src={homeImage}
        alt="Home"
        className="w-full max-w-md h-auto"
      />
    </div>
  );
};

export default HomePage;
