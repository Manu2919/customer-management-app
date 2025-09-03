import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CustomerList from '../components/CustomerList';
import './CustomerListPage.css'

const CustomerListPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://customer-management-app-07cm.onrender.com/api/customers`, {
                params: {
                    search: searchTerm,
                    page: currentPage,
                    limit: itemsPerPage
                }
            });
            setCustomers(response.data.data || response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch customers');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (customerId) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await axios.delete(`https://customer-management-app-07cm.onrender.com/api/customers/${customerId}`);
                fetchCustomers(); // Refresh the list
            } catch (err) {
                alert('Failed to delete customer');
            }
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [searchTerm, currentPage, itemsPerPage]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handleNextPage = () => setCurrentPage(prev => prev + 1);
    const handlePrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));

    return (
        <div className="customer-list-page">
            <h1>Customer List</h1>
            
            {/* Create New Customer Button */}
            <div className="header-actions">
                <Link to="/customers/new" className="btn btn-primary">
                    + Add New Customer
                </Link>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>
                
                <div className="pagination-controls">
                    <select 
                        value={itemsPerPage} 
                        onChange={handleItemsPerPageChange}
                        className="page-select"
                    >
                        <option value="5">5 per page</option>
                        <option value="10">10 per page</option>
                        <option value="20">20 per page</option>
                        <option value="50">50 per page</option>
                    </select>
                    
                    <button 
                        onClick={handlePrevPage} 
                        disabled={currentPage === 1}
                        className="page-btn"
                    >
                        Previous
                    </button>
                    
                    <span className="page-info">Page {currentPage}</span>
                    
                    <button 
                        onClick={handleNextPage}
                        className="page-btn"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Customer List Component */}
            <CustomerList 
                customers={customers}
                loading={loading}
                error={error}
                onDelete={handleDelete}
            />

            <div className="total-count">
                Total: {customers.length} customer(s)
            </div>
        </div>
    );
};
  

export default CustomerListPage;

