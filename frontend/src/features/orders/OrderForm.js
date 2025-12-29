import React, { useState, useEffect } from 'react';

const OrderForm = ({ initialData, onSubmit, onCancel }) => {
    const [order, setOrder] = useState({
        customerName: '',
        customerEmail: '',
        totalAmount: '',
        status: 'PENDING',
        comments: '',
    });

    useEffect(() => {
        if (initialData) {
            setOrder(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrder((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(order);
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">{initialData ? 'Edit Order' : 'Add New Order'}</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Customer Name</label>
                        <input
                            type="text"
                            name="customerName"
                            className="form-control"
                            value={order.customerName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Customer Email</label>
                        <input
                            type="email"
                            name="customerEmail"
                            className="form-control"
                            value={order.customerEmail}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Total Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            name="totalAmount"
                            className="form-control"
                            value={order.totalAmount}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            className="form-control"
                            value={order.status}
                            onChange={handleChange}
                        >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Comments</label>
                        <textarea
                            name="comments"
                            className="form-control"
                            value={order.comments || ''}
                            onChange={handleChange}
                            rows="3"
                        ></textarea>
                    </div>
                    <div className="mt-3">
                        <button type="submit" className="btn btn-success mr-2">
                            {initialData ? 'Update Order' : 'Create Order'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderForm;
