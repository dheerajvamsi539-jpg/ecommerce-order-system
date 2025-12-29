import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, addOrder, updateOrder, deleteOrder, addOrderComment } from './ordersSlice';
import { selectAuth } from '../auth/authSlice';
import OrderForm from './OrderForm';

const OrderList = () => {
    const dispatch = useDispatch();
    const { items, status, error } = useSelector((state) => state.orders);
    const { user } = useSelector(selectAuth);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [minAmount, setMinAmount] = useState('');
    const [newComment, setNewComment] = useState({});
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchOrders());
        }
    }, [status, dispatch]);

    const handleAddClick = () => {
        setEditingOrder(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (order) => {
        setEditingOrder(order);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            dispatch(deleteOrder(id));
        }
    };

    const handleFormSubmit = (order) => {
        if (editingOrder) {
            dispatch(updateOrder(order));
        } else {
            dispatch(addOrder(order));
        }
        setIsFormOpen(false);
    };

    const handleFormCancel = () => {
        setIsFormOpen(false);
    };

    const handleCommentSubmit = (id) => {
        if (newComment[id]) {
            dispatch(addOrderComment({ id, comment: newComment[id] }));
            setNewComment({ ...newComment, [id]: '' });
        }
    };

    if (status === 'loading') {
        return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div></div>;
    }

    if (status === 'failed') {
        return <div className="alert alert-danger mt-3">Error: {error}</div>;
    }

    const isAdmin = user && user.role === 'ROLE_ADMIN';

    const filteredItems = items.filter(item => {
        const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
        const matchesAmount = minAmount === '' || item.totalAmount >= parseFloat(minAmount);
        return matchesStatus && matchesAmount;
    });

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Orders</h2>
                <div className="d-flex align-items-center">
                    <select
                        className="form-control mr-3"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                    <div className="input-group mr-3" style={{ width: '180px' }}>
                        <div className="input-group-prepend">
                            <span className="input-group-text">$</span>
                        </div>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Min Amount"
                            value={minAmount}
                            onChange={(e) => setMinAmount(e.target.value)}
                        />
                    </div>
                    {isAdmin && (
                        <button className="btn btn-primary" onClick={handleAddClick}>
                            Add New Order
                        </button>
                    )}
                </div>
            </div>

            {isFormOpen && (
                <OrderForm
                    initialData={editingOrder}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            )}

            {filteredItems.length === 0 ? (
                <div className="alert alert-info">No orders found for the selected criteria.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Customer Name</th>
                                <th>Email</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Comments</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...filteredItems].sort((a, b) => b.id - a.id).map((order) => (
                                <React.Fragment key={order.id}>
                                    <tr
                                        onClick={() => setSelectedOrderId(selectedOrderId === order.id ? null : order.id)}
                                        style={{ cursor: 'pointer' }}
                                        className={selectedOrderId === order.id ? 'table-info' : ''}
                                        title="Click to view full lifecycle history"
                                    >
                                        <td>
                                            {order.id}
                                            <i className="fas fa-caret-down text-muted ml-2 small"></i>
                                        </td>
                                        <td>{order.customerName}</td>
                                        <td>{order.customerEmail}</td>
                                        <td>${order.totalAmount.toFixed(2)}</td>
                                        <td>
                                            <span className={`badge badge-${order.status === 'COMPLETED' ? 'success' :
                                                order.status === 'CANCELLED' ? 'danger' :
                                                    order.status === 'SHIPPED' ? 'info' :
                                                        'warning'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="small text-muted mb-1">{order.comments || 'No comments'}</div>
                                            <div className="input-group input-group-sm" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Add comment..."
                                                    value={newComment[order.id] || ''}
                                                    onChange={(e) => setNewComment({ ...newComment, [order.id]: e.target.value })}
                                                />
                                                <div className="input-group-append">
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        type="button"
                                                        onClick={() => handleCommentSubmit(order.id)}
                                                    >
                                                        Post
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                {isAdmin && (
                                                    <>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary mr-2"
                                                            onClick={() => handleEditClick(order)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDeleteClick(order.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                                {!isAdmin && <span className="text-muted small">View Only</span>}
                                            </div>
                                        </td>
                                    </tr>
                                    {selectedOrderId === order.id && (
                                        <tr>
                                            <td colSpan="7" className="bg-light">
                                                <div className="p-3">
                                                    <h6 className="mb-3 border-bottom pb-2">
                                                        <i className="fas fa-history mr-2"></i>Order Lifecycle
                                                    </h6>
                                                    <div className="timeline-small pl-3 border-left">
                                                        <ul className="list-unstyled mb-0">
                                                            {order.statusHistory && [...order.statusHistory]
                                                                .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))
                                                                .map((history, idx) => (
                                                                    <li key={history.id || idx} className="mb-3 position-relative">
                                                                        <div className="d-flex align-items-center">
                                                                            <span className={`badge badge-${history.status === 'COMPLETED' ? 'success' :
                                                                                    history.status === 'CANCELLED' ? 'danger' :
                                                                                        history.status === 'SHIPPED' ? 'info' :
                                                                                            'secondary'
                                                                                } mr-3`} style={{ width: '100px' }}>{history.status}</span>
                                                                            <span className="text-dark font-weight-bold">
                                                                                {new Date(history.changedAt).toLocaleString()}
                                                                            </span>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            <li className="mb-3 position-relative">
                                                                <div className="d-flex align-items-center">
                                                                    <span className="badge badge-light border mr-3" style={{ width: '100px' }}>CREATED</span>
                                                                    <span className="text-muted">
                                                                        {new Date(order.createdAt).toLocaleString()} (Order Placed)
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderList;
