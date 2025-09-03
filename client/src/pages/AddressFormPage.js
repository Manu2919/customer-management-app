/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AddressForm from '../components/AddressForm';
import './AddressFormPage.css';

const AddressFormPage = () => {
    const { customerId, addressId } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(addressId);
    
    const [formData, setFormData] = useState({
        address_details: '',
        city: '',
        state: '',
        pin_code: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchAddress();
        }
    }, [addressId]);

    const fetchAddress = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://customer-management-app-07cm.onrender.com/api/addresses/${addressId}`);
            const address = response.data.data || response.data;
            setFormData({
                address_details: address.address_details,
                city: address.city,
                state: address.state,
                pin_code: address.pin_code
            });
        } catch (err) {
            setSubmitError('Failed to load address data');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.address_details.trim()) {
            newErrors.address_details = 'Address details are required';
        }
        
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }
        
        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
        }
        
        if (!formData.pin_code.trim()) {
            newErrors.pin_code = 'PIN code is required';
        } else if (!/^\d{6}$/.test(formData.pin_code)) {
            newErrors.pin_code = 'PIN code must be 6 digits';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setSubmitError('');

        try {
            if (isEditMode) {
                await axios.put(`https://customer-management-app-07cm.onrender.com/api/addresses/${addressId}`, formData);
            } else {
                await axios.post(`https://customer-management-app-07cm.onrender.com/api/customers/${customerId}/addresses`, formData);
            }
            
            navigate(`/customers/${customerId}`);
        } catch (err) {
            setSubmitError('Failed to save address. Please try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(`/customers/${customerId}`);
    };

    if (loading && isEditMode) {
        return <div className="loading">Loading address data...</div>;
    }

    return (
        <div className="address-form-page">
            <Link to={`/customers/${customerId}`} className="back-button">
                ← Back to Customer
            </Link>

            <h1>{isEditMode ? 'Edit Address' : 'Add New Address'}</h1>
            
            {submitError && (
                <div className="error-message">
                    {submitError}
                </div>
            )}

            <AddressForm
                formData={formData}
                errors={errors}
                loading={loading}
                isEditMode={isEditMode}
                onSubmit={handleSubmit}
                onInputChange={handleInputChange}
                onCancel={handleCancel}
            />
        </div>
    );
};


export default AddressFormPage;

