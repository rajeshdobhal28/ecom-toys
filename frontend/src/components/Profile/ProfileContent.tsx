'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API, makeApiRequest } from '@/api/api';
import styles from './ProfileContent.module.css';
import { User, MapPin, Trash2, Star, Plus } from 'lucide-react';
import AddressModal from './AddressModal';

interface Address {
    id: string;
    address: string;
    city: string;
    state: string;
    pincode: number;
    phone_number: number;
    is_default: boolean;
}

export default function ProfileContent() {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAddresses = async () => {
        try {
            const response = await makeApiRequest(API.GET_ADDRESSES, {});
            if (response.status === 'success') {
                setAddresses(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAddresses();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            const apiEndpoint = { ...API.DELETE_ADDRESS, url: `${API.DELETE_ADDRESS.url}/${id}` };
            const response = await makeApiRequest(apiEndpoint, {});
            if (response.status === 'success') {
                fetchAddresses();
            }
        } catch (err) {
            alert('Failed to delete address');
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            const apiEndpoint = { ...API.SET_DEFAULT_ADDRESS, url: `${API.SET_DEFAULT_ADDRESS.url}/${id}/default` };
            const response = await makeApiRequest(apiEndpoint, {});
            if (response.status === 'success') {
                fetchAddresses();
            }
        } catch (err) {
            alert('Failed to set default address');
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading profile...</div>;
    }

    if (!user) {
        return <div className={styles.error}>Please log in to view your profile.</div>;
    }

    return (
        <div className={styles.profileContainer}>
            {/* User Info Section */}
            <section className={styles.userInfoCard}>
                <div className={styles.avatarWrapper}>
                    {user.picture ? (
                        <img src={user.picture} alt={user.name} className={styles.avatar} />
                    ) : (
                        <div className={styles.avatarPlaceholder}>
                            <User size={40} color="var(--text-muted)" />
                        </div>
                    )}
                </div>
                <div className={styles.userDetails}>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                </div>
            </section>

            {/* Addresses Section */}
            <section className={styles.addressesSection}>
                <div className={styles.addressesHeader}>
                    <h3>My Addresses</h3>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} /> Add New Address
                    </button>
                </div>

                {addresses.length === 0 ? (
                    <div className={styles.noAddresses}>
                        <MapPin size={48} color="var(--border)" />
                        <p>You haven't saved any addresses yet.</p>
                    </div>
                ) : (
                    <div className={styles.addressGrid}>
                        {addresses.map((addr) => (
                            <div key={addr.id} className={`${styles.addressCard} ${addr.is_default ? styles.defaultCard : ''}`}>
                                {addr.is_default && <span className={styles.defaultBadge}><Star size={12} fill="currentColor" /> Default</span>}
                                <p>{addr.address}</p>
                                <p>{addr.city}, {addr.state} {addr.pincode}</p>
                                <p>Phone: {addr.phone_number}</p>

                                <div className={styles.addressActions}>
                                    {!addr.is_default && (
                                        <button className={styles.actionBtn} onClick={() => handleSetDefault(addr.id)}>
                                            Set as Default
                                        </button>
                                    )}
                                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(addr.id)}>
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {isModalOpen && (
                <AddressModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchAddresses();
                    }}
                />
            )}
        </div>
    );
}
