import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccounts, createAccount, fetchTransactions, recordTransaction } from './accountingSlice';

const AccountList = () => {
    const dispatch = useDispatch();
    const accounts = useSelector((state) => state.accounting.accounts);
    const transactions = useSelector((state) => state.accounting.currentTransactions);
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [newAccountName, setNewAccountName] = useState('');

    // Transaction form state
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('INCOME');

    useEffect(() => {
        dispatch(fetchAccounts());
    }, [dispatch]);

    const handleCreateAccount = (e) => {
        e.preventDefault();
        if (newAccountName) {
            dispatch(createAccount(newAccountName));
            setNewAccountName('');
        }
    };

    const handleSelectAccount = (id) => {
        setSelectedAccountId(id);
        dispatch(fetchTransactions(id));
    };

    const handleRecordTransaction = (e) => {
        e.preventDefault();
        if (selectedAccountId && description && amount) {
            dispatch(recordTransaction({
                accountId: selectedAccountId,
                description,
                amount,
                type
            }));
            setDescription('');
            setAmount('');
        }
    };

    return (
        <div className="row">
            <div className="col-md-4">
                <h3>Accounts</h3>
                <form onSubmit={handleCreateAccount} className="mb-3 d-flex">
                    <input
                        type="text"
                        className="form-control mr-2"
                        placeholder="Account Name"
                        value={newAccountName}
                        onChange={(e) => setNewAccountName(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary btn-sm">Add</button>
                </form>
                <div className="list-group">
                    {accounts.map(account => (
                        <button
                            key={account.id}
                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedAccountId === account.id ? 'active' : ''}`}
                            onClick={() => handleSelectAccount(account.id)}
                        >
                            {account.name}
                            <span className="badge badge-light badge-pill">
                                ${account.balance.toFixed(2)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="col-md-8">
                {selectedAccountId ? (
                    <>
                        <h3>Transactions for {accounts.find(a => a.id === selectedAccountId)?.name}</h3>

                        <form onSubmit={handleRecordTransaction} className="card p-3 mb-4 shadow-sm">
                            <div className="form-row">
                                <div className="col-md-5">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        placeholder="Amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-2">
                                    <select className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
                                        <option value="INCOME">Income</option>
                                        <option value="EXPENSE">Expense</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <button type="submit" className="btn btn-success btn-block">Record</button>
                                </div>
                            </div>
                        </form>

                        <div className="table-responsive">
                            <table className="table table-striped table-sm">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Type</th>
                                        <th className="text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(tx => (
                                        <tr key={tx.id}>
                                            <td>{new Date(tx.timestamp).toLocaleString()}</td>
                                            <td>{tx.description}</td>
                                            <td>
                                                <span className={`badge ${tx.type === 'INCOME' ? 'badge-success' : 'badge-danger'}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className={`text-right ${tx.type === 'INCOME' ? 'text-success' : 'text-danger'}`}>
                                                {tx.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="alert alert-info">Select an account to view transactions</div>
                )}
            </div>
        </div>
    );
};

export default AccountList;
