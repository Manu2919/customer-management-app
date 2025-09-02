import React from 'react';
import { Link } from 'react-router-dom';
import './CustomerList.css';

const CustomerList = ({ customers, loading, error, onDelete }) => {
    if (loading) return <div className="loading">Loading customers...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="customer-list">
            {/* Customers Table */}
            <div className="customers-table-container">
                <table className="customers-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-data">
                                    No customers found
                                </td>
                            </tr>
                        ) : (
                            customers.map(customer => (
                                <tr key={customer.id}>
                                    <td>{customer.id}</td>
                                    <td>{customer.first_name}</td>
                                    <td>{customer.last_name}</td>
                                    <td>{customer.phone_number}</td>
                                    <td>
                                        <Link to={`/customers/${customer.id}`} className="action-btn view">
                                            View
                                        </Link>
                                        <Link to={`/customers/edit/${customer.id}`} className="action-btn edit">
                                            Edit
                                        </Link>
                                        <button 
                                            className="action-btn delete"
                                            onClick={() => onDelete(customer.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerList;