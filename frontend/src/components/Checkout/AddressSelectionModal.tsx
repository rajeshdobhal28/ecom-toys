'use client';

import React, { useState } from 'react';
import { X, MapPin, Plus } from 'lucide-react';
import styles from './AddressSelectionModal.module.css';

interface AddressSelectionModalProps {
    addresses: any[];
    currentSelectedId: string | null;
    onSelect: (addressId: string) => void;
    onAddNew: () => void;
    onEdit: (address: any) => void;
    onClose: () => void;
}

export default function AddressSelectionModal({
    addresses,
    currentSelectedId,
    onSelect,
    onAddNew,
    onEdit,
    onClose
}: AddressSelectionModalProps) {
    const [localSelectedId, setLocalSelectedId] = useState<string | null>(currentSelectedId);

    const handleConfirm = () => {
        if (localSelectedId) {
            onSelect(localSelectedId);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Select Delivery Address</h2>
                    <button onClick={onClose} className={styles.closeBtn} aria-label="Close">
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.content}>
                    {addresses.length === 0 ? (
                        <div className={styles.emptyState}>
                            <MapPin size={48} className={styles.emptyIcon} />
                            <p>You don't have any saved addresses.</p>
                        </div>
                    ) : (
                        <div className={styles.addressList}>
                            {addresses.map((addr) => (
                                <label
                                    key={addr.id}
                                    className={`${styles.addressCard} ${localSelectedId === addr.id ? styles.selected : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="modalAddressSelection"
                                        value={addr.id}
                                        checked={localSelectedId === addr.id}
                                        onChange={() => setLocalSelectedId(addr.id)}
                                        className={styles.radioInput}
                                    />
                                    <div className={styles.addressDetails}>
                                        <div className={styles.addressHeader}>
                                            <div className={styles.nameHeader}>
                                                <strong>{addr.full_name}</strong>
                                                {addr.is_default && <span className={styles.defaultBadge}>Default</span>}
                                            </div>
                                            <button
                                                className={styles.editBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    onEdit(addr);
                                                }}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <p>{addr.address}</p>
                                        <p>{addr.city}, {addr.state} {addr.pincode}</p>
                                        <p>Phone: {addr.phone_number}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button className={styles.addNewBtn} onClick={onAddNew}>
                        <Plus size={18} /> Add New Address
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleConfirm}
                        disabled={!localSelectedId || addresses.length === 0}
                    >
                        Confirm Selection
                    </button>
                </div>
            </div>
        </div>
    );
}
