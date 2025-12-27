import React from 'react';
import './App.css';
import OrderList from './features/orders/OrderList';

function App() {
  return (
    <div className="App">
      <header className="App-header bg-dark text-white p-3">
        <h1>E-Commerce Order Management</h1>
      </header>
      <main className="container">
        <OrderList />
      </main>
    </div>
  );
}

export default App;