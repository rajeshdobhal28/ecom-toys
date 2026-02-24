'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { API, makeApiRequest } from '@/api/api';
import Link from 'next/link';
import styles from './Checkout.module.css';
import AddressModal from '@/components/Profile/AddressModal';
import AddressSelectionModal from '@/components/Checkout/AddressSelectionModal';
import { ChevronRight, CreditCard, Lock, MapPin, Truck } from 'lucide-react';

export default function CheckoutPage() {
    const { user, loading: authLoading } = useAuth();
    const { items, total, clearCart, isInitialized } = useCart();
    const router = useRouter();

    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showAddressSelectionModal, setShowAddressSelectionModal] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Redirect if empty cart or not logged in (handled after auth loads)
    useEffect(() => {
        if (!authLoading && isInitialized) {
            if (!user) {
                router.push('/login?redirect=/checkout');
            } else if (items.length === 0) {
                router.push('/shop');
            } else {
                fetchAddresses();
            }
        }
    }, [user, authLoading, isInitialized, items.length, router]);

    const fetchAddresses = async () => {
        setLoadingAddresses(true);
        try {
            const response = await makeApiRequest(API.GET_ADDRESSES, {});
            if (response.status === 'success') {
                setAddresses(response.data);
                const defaultAddr = response.data.find((a: any) => a.is_default);
                if (defaultAddr) {
                    setSelectedAddressId(defaultAddr.id);
                } else if (response.data.length > 0) {
                    setSelectedAddressId(response.data[0].id);
                }
            }
        } catch (err) {
            console.error('Failed to fetch addresses', err);
        } finally {
            setLoadingAddresses(false);
        }
    };

    const handleAddressAdded = () => {
        setShowAddressModal(false);
        fetchAddresses();
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            alert('Please select a delivery address');
            return;
        }

        setIsPlacingOrder(true);
        try {
            const products = items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
            }));

            const response = await makeApiRequest(API.CREATE_ORDER, {
                products,
                addressId: selectedAddressId,
            });

            if (response.status === 'success') {
                clearCart();
                alert('Order placed successfully!');
                router.push('/orders');
            } else {
                alert(response.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('An error occurred during checkout');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (authLoading || !isInitialized || (!user && items.length > 0)) {
        return (
            <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h2>Loading checkout...</h2>
            </div>
        );
    }

    if (items.length === 0) {
        return null; // Will redirect via useEffect
    }

    const shippingCost = total > 500 ? 0 : 50;
    const finalTotal = total + shippingCost;

    return (
        <div className={styles.checkoutPage}>
            <div className={`container ${styles.container}`}>
                <div className={styles.breadcrumb}>
                    <Link href="/cart">Cart</Link>
                    <ChevronRight size={16} />
                    <span>Checkout</span>
                </div>

                <h1 className={styles.pageTitle}>Checkout</h1>

                <div className={styles.layout}>
                    {/* LEFT COLUMN: Details */}
                    <div className={styles.mainCard}>
                        {/* Delivery Address Section */}
                        <div className={styles.innerSection}>
                            <div className={styles.innerSectionHeader}>
                                <div className={styles.sectionIcon}><MapPin size={20} /></div>
                                <h2>Delivery Address</h2>
                            </div>

                            {loadingAddresses ? (
                                <p>Loading addresses...</p>
                            ) : addresses.length === 0 ? (
                                <div className={styles.emptyAddressInfo}>
                                    <p>You don't have any saved addresses yet.</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setShowAddressModal(true)}
                                    >
                                        Add New Address
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    {(() => {
                                        const selectedAddress = addresses.find(a => a.id === selectedAddressId);
                                        if (!selectedAddress) return <p>No address selected</p>;
                                        return (
                                            <div className={styles.selectedAddressDisplay}>
                                                <div className={styles.addressDetailsCol}>
                                                    <div className={styles.addressDisplayHeader}>
                                                        <strong>{selectedAddress.full_name}</strong>
                                                        <span className={styles.addressTypeBadge}>
                                                            {selectedAddress.is_default ? 'Default' : 'Delivery'}
                                                        </span>
                                                    </div>
                                                    <span className={styles.compactText}>{selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}</span>
                                                    <span className={styles.compactText}>Phone: {selectedAddress.phone_number}</span>
                                                </div>
                                                <button
                                                    className={styles.changeAddressBtn}
                                                    onClick={() => setShowAddressSelectionModal(true)}
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>

                        <div className={styles.sectionDivider}></div>

                        {/* Payment Placeholder Section */}
                        <div className={styles.innerSection}>
                            <div className={styles.innerSectionHeader}>
                                <div className={styles.sectionIcon}><CreditCard size={20} /></div>
                                <h2>Payment Method</h2>
                            </div>
                            <div className={styles.paymentMethods}>
                                <label className={`${styles.paymentCard} ${styles.selectedPayment}`}>
                                    <input type="radio" name="payment" checked readOnly className={styles.radioInput} />
                                    <div className={styles.paymentContent}>
                                        <strong>Pay at Delivery / Standard Processing</strong>
                                        <p>We'll handle the payment collection smoothly.</p>
                                    </div>
                                </label>

                                <label className={`${styles.paymentCard} ${styles.disabledPayment}`}>
                                    <input type="radio" name="payment" disabled className={styles.radioInput} />
                                    <div className={styles.paymentContent}>
                                        <strong>Razorpay Integration (Coming Soon)</strong>
                                        <p>Credit/Debit cards, UPI, Netbanking.</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className={styles.summaryCard}>
                        <h2>Order Summary</h2>

                        <div className={styles.summaryItems}>
                            {items.map(item => (
                                <div key={item.id} className={styles.summaryItem}>
                                    <div className={styles.itemImage}>
                                        <img src={item.imageUrl} alt={item.title} />
                                        <span className={styles.itemQuantity}>{item.quantity}</span>
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <h4>{item.title}</h4>
                                        <p>₹{item.price.toFixed(2)}</p>
                                    </div>
                                    <div className={styles.itemTotal}>
                                        <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.costBreakdown}>
                            <div className={styles.costRow}>
                                <span>Subtotal</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <div className={styles.costRow}>
                                <span>Shipping <Truck size={14} style={{ marginLeft: 4, verticalAlign: 'middle' }} /></span>
                                <span>{shippingCost === 0 ? <em style={{ color: '#27ae60' }}>Free</em> : `₹${shippingCost.toFixed(2)}`}</span>
                            </div>
                            {/* Visual divider */}
                            <div className={styles.divider}></div>
                            <div className={`${styles.costRow} ${styles.finalTotalRow}`}>
                                <span>Total</span>
                                <span>₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            className={`btn btn-primary ${styles.placeOrderBtn}`}
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder || !selectedAddressId}
                        >
                            {isPlacingOrder ? 'Processing Order...' : `Pay ₹${finalTotal.toFixed(2)}`}
                        </button>

                        <div className={styles.securityNote}>
                            <Lock size={14} />
                            <span>Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>

            {showAddressSelectionModal && (
                <AddressSelectionModal
                    addresses={addresses}
                    currentSelectedId={selectedAddressId}
                    onSelect={(id) => {
                        setSelectedAddressId(id);
                        setShowAddressSelectionModal(false);
                    }}
                    onAddNew={() => {
                        setShowAddressSelectionModal(false);
                        setShowAddressModal(true);
                    }}
                    onClose={() => setShowAddressSelectionModal(false)}
                />
            )}

            {showAddressModal && (
                <AddressModal
                    onClose={() => setShowAddressModal(false)}
                    onSuccess={handleAddressAdded}
                />
            )}
        </div>
    );
}
