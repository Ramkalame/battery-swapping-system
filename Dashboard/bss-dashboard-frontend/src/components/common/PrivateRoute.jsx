import React from 'react';

const PrivateRoute = ({ children }) => {
  return (
    <div className='' style={{ backgroundColor: "#0f0f0f", height: "100vh", overflowX: "hidden" }}>
      <div className='d-flex' style={{ position: "relative" }}>
        <div className='main' style={{ flexGrow: 1, padding: "0 20px", width: "100%", overflow: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PrivateRoute;
