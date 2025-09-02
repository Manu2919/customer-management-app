import React from 'react';
import './CustomerForm.css';

const CustomerForm = ({ 
    formData, 
    errors, 
    loading, 
    isEditMode, 
    onSubmit, 
    onInputChange, 
    onCancel 
}) => {
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="customer-form-component">
            <form onSubmit={handleSubmit} className="customer-form">
                <div className="form-group">
                    <label htmlFor="first_name">First Name *</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={onInputChange}
                        className={errors.first_name ? 'error' : ''}
                        placeholder="Enter first name"
                        disabled={loading}
                    />
                    {errors.first_name && (
                        <span className="error-text">{errors.first_name}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="last_name">Last Name *</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={onInputChange}
                        className={errors.last_name ? 'error' : ''}
                        placeholder="Enter last name"
                        disabled={loading}
                    />
                    {errors.last_name && (
                        <span className="error-text">{errors.last_name}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="phone_number">Phone Number *</label>
                    <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={onInputChange}
                        className={errors.phone_number ? 'error' : ''}
                        placeholder="Enter 10-digit phone number"
                        disabled={loading}
                        maxLength="10"
                    />
                    {errors.phone_number && (
                        <span className="error-text">{errors.phone_number}</span>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-secondary"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (isEditMode ? 'Update Customer' : 'Create Customer')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CustomerForm;