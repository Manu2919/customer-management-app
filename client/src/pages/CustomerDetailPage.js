/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AddressList from '../components/AddressList';
import './CustomerDetailPage.css';

const CustomerDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [customer, setCustomer] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addressLoading, setAddressLoading] = useState(false);

    const fetchCustomerData = async () => {
        try {
            setLoading(true);
            
            // Fetch customer details
            const customerResponse = await axios.get(`https://customer-management-app-07cm.onrender.com/api/customers/${id}`);
            setCustomer(customerResponse.data.data || customerResponse.data);
            
            // Fetch customer addresses
            await fetchAddresses();
            
            setError('');
        } catch (err) {
            setError('Failed to fetch customer data');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAddresses = async () => {
        try {
            setAddressLoading(true);
            const response = await axios.get(`https://customer-management-app-07cm.onrender.com/api/customers/${id}/addresses`);
            setAddresses(response.data.addresses || response.data || []);
        } catch (err) {
            console.error('Error fetching addresses:', err);
        } finally {
            setAddressLoading(false);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await axios.delete(`https://customer-management-app-07cm.onrender.com/api/addresses/${addressId}`);
                fetchAddresses(); // Refresh addresses
            } catch (err) {
                alert('Failed to delete address');
            }
        }
    };

    const handleEditAddress = (addressId) => {
        navigate(`/addresses/edit/${addressId}`);
    };

    useEffect(() => {
        fetchCustomerData();
    }, [id]);

    if (loading) return <div className="loading">Loading customer details...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!customer) return <div className="error">Customer not found</div>;

    return (
        <div className="customer-detail-page">
            <Link to="/customers" className="back-button">
                ← Back to Customers
            </Link>

            <h1>Customer Details</h1>
            
            {/* Customer Information Card */}
            <div className="customer-card">
                <h2>Personal Information</h2>
                <div className="customer-info">
                    <div className="info-row">
                        <span className="label">ID:</span>
                        <span className="value">{customer.id}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">First Name:</span>
                        <span className="value">{customer.first_name}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Last Name:</span>
                        <span className="value">{customer.last_name}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Phone Number:</span>
                        <span className="value">{customer.phone_number}</span>
                    </div>
                </div>
            </div>

            {/* Address List Component */}
            <AddressList
                addresses={addresses}
                loading={addressLoading}
                error={null}
                onDeleteAddress={handleDeleteAddress}
                onEditAddress={handleEditAddress}
                customerId={id}
            />

            {/* Add Address Button */}
            <div className="add-address-section">
                <Link to={`/customers/${id}/add-address`} className="btn btn-primary">
                    + Add New Address
                </Link>
            </div>
        </div>
    );
};


export default CustomerDetailPage;



