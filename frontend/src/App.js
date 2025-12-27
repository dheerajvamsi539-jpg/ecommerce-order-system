import { useSelector, useDispatch } from 'react-redux';
import OrderList from './features/orders/OrderList';
import Login from './features/auth/Login';
import { selectAuth, logout } from './features/auth/authSlice';

function App() {
  const { isAuthenticated, user } = useSelector(selectAuth);
  const dispatch = useDispatch();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="App">
      <header className="App-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
        <h1>E-Commerce Order Management</h1>
        <div>
          <span className="mr-3">Welcome, {user.username} ({user.role})</span>
          <button className="btn btn-outline-light btn-sm ml-2" onClick={() => dispatch(logout())}>Logout</button>
        </div>
      </header>
      <main className="container mt-4">
        <OrderList />
      </main>
    </div>
  );
}

export default App;