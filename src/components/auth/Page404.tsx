import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-5xl font-bold text-red-600">404</h1>
      <p className="text-xl mt-2 text-gray-700">Page not found!</p>
    </div>
  );
};

export default NotFound;
