import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CustomerForm from '../components/CustomerForm';
import './CustomerFormPage.css';

const CustomerFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchCustomer();
        }
    }, [id]);

    const fetchCustomer = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/customers/${id}`);
            const customer = response.data.data || response.data;
            setFormData({
                first_name: customer.first_name,
                last_name: customer.last_name,
                phone_number: customer.phone_number
            });
        } catch (err) {
            setSubmitError('Failed to load customer data');
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
        
        if (!formData.first_name.trim()) {
            newErrors.first_name = 'First name is required';
        }
        
        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Last name is required';
        }
        
        if (!formData.phone_number.trim()) {
            newErrors.phone_number = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone_number)) {
            newErrors.phone_number = 'Phone number must be 10 digits';
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
                await axios.put(`http://localhost:5000/api/customers/${id}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/customers', formData);
            }
            
            navigate('/customers');
        } catch (err) {
            if (err.response?.data?.error?.includes('already exists')) {
                setErrors({ phone_number: 'Phone number already exists' });
            } else {
                setSubmitError('Failed to save customer. Please try again.');
            }
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/customers');
    };

    if (loading && isEditMode) {
        return <div className="loading">Loading customer data...</div>;
    }

    return (
        <div className="customer-form-page">
            <Link to="/customers" className="back-button">
                ← Back to Customers
            </Link>

            <h1>{isEditMode ? 'Edit Customer' : 'Create New Customer'}</h1>
            
            {submitError && (
                <div className="error-message">
                    {submitError}
                </div>
            )}

            {/* Use the CustomerForm component */}
            <CustomerForm
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

export default CustomerFormPage;