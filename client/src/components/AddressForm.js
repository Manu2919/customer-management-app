import React from 'react';
import './AddressForm.css';

const AddressForm = ({ 
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
        <div className="address-form-component">
            <form onSubmit={handleSubmit} className="address-form">
                <div className="form-group">
                    <label htmlFor="address_details">Address Details *</label>
                    <textarea
                        id="address_details"
                        name="address_details"
                        value={formData.address_details}
                        onChange={onInputChange}
                        className={errors.address_details ? 'error' : ''}
                        placeholder="Enter full address (house no, street, area)"
                        disabled={loading}
                        rows="3"
                    />
                    {errors.address_details && (
                        <span className="error-text">{errors.address_details}</span>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="city">City *</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={onInputChange}
                            className={errors.city ? 'error' : ''}
                            placeholder="Enter city"
                            disabled={loading}
                        />
                        {errors.city && (
                            <span className="error-text">{errors.city}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="state">State *</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={onInputChange}
                            className={errors.state ? 'error' : ''}
                            placeholder="Enter state"
                            disabled={loading}
                        />
                        {errors.state && (
                            <span className="error-text">{errors.state}</span>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="pin_code">PIN Code *</label>
                    <input
                        type="text"
                        id="pin_code"
                        name="pin_code"
                        value={formData.pin_code}
                        onChange={onInputChange}
                        className={errors.pin_code ? 'error' : ''}
                        placeholder="Enter 6-digit PIN code"
                        disabled={loading}
                        maxLength="6"
                    />
                    {errors.pin_code && (
                        <span className="error-text">{errors.pin_code}</span>
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
                        {loading ? 'Saving...' : (isEditMode ? 'Update Address' : 'Add Address')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddressForm;