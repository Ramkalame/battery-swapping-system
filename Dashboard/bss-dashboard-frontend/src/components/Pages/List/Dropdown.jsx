import React, { useState } from 'react';
import CustomerList from './CustomerList';
import SellList from './SellList';
import ShopList from './ShopList';
import BatteryTransactionList from './BatteryTransactionList';
import { Dropdown, Container } from 'react-bootstrap';

const DropdownComponent = ({type}) => {
 

  const renderSelectedComponent = (selectedComponent) => {
    switch (selectedComponent) {
      case 'customer':
        return <CustomerList />;
      case 'sell':
        return <SellList />;
      case 'shop':
        return <ShopList />;
      case 'battery':
        return <BatteryTransactionList />;
    
    }
  };

  return (
    <Container className="mt-4">
      <div style={{ marginTop: '20px' }}>
        {renderSelectedComponent(type)}
      </div>
    </Container>
  );
};

export default DropdownComponent;
