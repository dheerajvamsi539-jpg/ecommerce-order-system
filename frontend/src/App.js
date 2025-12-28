import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OrderList from './features/orders/OrderList';
import AccountList from './features/accounting/AccountList';
import Login from './features/auth/Login';
import { selectAuth, logout } from './features/auth/authSlice';

function App() {
  const { isAuthenticated, user } = useSelector(selectAuth);
  const [activeTab, setActiveTab] = useState('orders');
  const dispatch = useDispatch();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="App">
      <header className="App-header bg-dark text-white p-3 d-flex justify-content-between align-items-center shadow-sm">
        <div className="d-flex align-items-center">
          <h1 className="h4 mb-0 mr-4">E-Commerce MS</h1>
          <nav className="nav nav-pills">
            <button
              className={`nav-link btn btn-link text-white ${activeTab === 'orders' ? 'active bg-primary' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
            <button
              className={`nav-link btn btn-link text-white ${activeTab === 'accounting' ? 'active bg-primary' : ''}`}
              onClick={() => setActiveTab('accounting')}
            >
              Accounting
            </button>
          </nav>
        </div>
        <div>
          <span className="mr-3">Welcome, <strong>{user.username}</strong> ({user.role})</span>
          <button className="btn btn-outline-light btn-sm ml-2" onClick={() => dispatch(logout())}>Logout</button>
        </div>
      </header>
      <main className="container-fluid mt-4 px-4">
        {activeTab === 'orders' ? <OrderList /> : <AccountList />}
      </main>
    </div>
  );
}

export default App;