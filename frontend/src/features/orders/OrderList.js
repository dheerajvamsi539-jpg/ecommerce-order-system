import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, addOrder, updateOrder, deleteOrder } from './ordersSlice';
import OrderForm from './OrderForm';

const OrderList = () => {
    const dispatch = useDispatch();
    const { items, status, error } = useSelector((state) => state.orders);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);

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

    if (status === 'loading') {
        return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div></div>;
    }

    if (status === 'failed') {
        return <div className="alert alert-danger mt-3">Error: {error}</div>;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Orders</h2>
                <button className="btn btn-primary" onClick={handleAddClick}>
                    Add New Order
                </button>
            </div>

            {isFormOpen && (
                <OrderForm
                    initialData={editingOrder}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            )}

            {items.length === 0 ? (
                <div className="alert alert-info">No orders found.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Customer Name</th>
                                <th>Email</th>
                                <th>Total Amout</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...items].sort((a, b) => b.id - a.id).map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.customerName}</td>
                                    <td>{order.customerEmail}</td>
                                    <td>${order.totalAmount}</td>
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
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderList;
