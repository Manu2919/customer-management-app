import React from 'react';
import './AddressList.css';

const AddressList = ({ 
    addresses, 
    loading, 
    error, 
    onDeleteAddress, 
    onEditAddress,
    customerId 
}) => {
    
    if (loading) return <div className="loading-addresses">Loading addresses...</div>;
    if (error) return <div className="error-addresses">Error: {error}</div>;

    return (
        <div className="address-list">
            <div className="addresses-header">
                <h3>Addresses ({addresses.length})</h3>
            </div>

            {addresses.length === 0 ? (
                <div className="no-addresses">
                    <p>No addresses found for this customer.</p>
                </div>
            ) : (
                <div className="addresses-grid">
                    {addresses.map(address => (
                        <div key={address.id} className="address-card">
                            <div className="address-details">
                                <h4>Address #{address.id}</h4>
                                <div className="address-field">
                                    <strong>Details:</strong> 
                                    <span>{address.address_details}</span>
                                </div>
                                <div className="address-field">
                                    <strong>City:</strong> 
                                    <span>{address.city}</span>
                                </div>
                                <div className="address-field">
                                    <strong>State:</strong> 
                                    <span>{address.state}</span>
                                </div>
                                <div className="address-field">
                                    <strong>PIN Code:</strong> 
                                    <span>{address.pin_code}</span>
                                </div>
                            </div>
                            
                            <div className="address-actions">
                                <button 
                                    className="btn btn-sm btn-edit"
                                    onClick={() => onEditAddress(address.id)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="btn btn-sm btn-delete"
                                    onClick={() => onDeleteAddress(address.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressList;