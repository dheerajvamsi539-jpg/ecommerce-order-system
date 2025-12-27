import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './authSlice';

const Login = () => {
    const [username, setUsername] = useState('viewer');
    const [password, setPassword] = useState('password');
    const dispatch = useDispatch();

    const handleLogin = (e) => {
        e.preventDefault();
        // In a real app, you'd verify credentials with the backend
        // For this demo, we'll just set the role based on username
        const role = username === 'admin' ? 'ROLE_ADMIN' : 'ROLE_VIEWER';
        const authHeader = 'Basic ' + btoa(username + ':' + password);
        dispatch(login({ username, role, authHeader }));
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0 text-center">Login</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleLogin}>
                                <div className="form-group mb-3">
                                    <label>Username</label>
                                    <select
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    >
                                        <option value="viewer">viewer (Level 1)</option>
                                        <option value="admin">admin (Level 2)</option>
                                    </select>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Login</button>
                            </form>
                            <div className="mt-3 small text-muted">
                                * Note: Password is 'password' for both users.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
