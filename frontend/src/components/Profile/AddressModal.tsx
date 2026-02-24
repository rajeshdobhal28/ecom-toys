'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { API, makeApiRequest } from '@/api/api';
import styles from './AddressModal.module.css';

interface AddressModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddressModal({ onClose, onSuccess }: AddressModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone_number: '',
        is_default: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await makeApiRequest(API.ADD_ADDRESS, formData);
            if (response.status === 'success') {
                onSuccess();
            } else {
                setError(response.message || 'Failed to add address');
            }
        } catch (err) {
            setError('An error occurred while adding the address');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>Add New Address</h3>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                        <X size={24} />
                    </button>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="address">Address (Street, Apt)</label>
                        <input type="text" id="address" name="address" required value={formData.address} onChange={handleChange} />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="phone_number">Phone Number</label>
                        <input type="tel" id="phone_number" name="phone_number" required value={formData.phone_number} onChange={handleChange} pattern="\d{10}" title="Must be exactly 10 digits" />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label htmlFor="city">City</label>
                            <input type="text" id="city" name="city" required value={formData.city} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="state">State</label>
                            <input type="text" id="state" name="state" required value={formData.state} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="pincode">Pincode</label>
                            <input type="text" id="pincode" name="pincode" required value={formData.pincode} onChange={handleChange} pattern="\d+" title="Must contain numbers only" />
                        </div>
                    </div>

                    <div className={styles.checkboxGroup}>
                        <input type="checkbox" id="is_default" name="is_default" checked={formData.is_default} onChange={handleChange} />
                        <label htmlFor="is_default">Set as default address</label>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Address'}
                    </button>
                </form>
            </div>
        </div>
    );
}
