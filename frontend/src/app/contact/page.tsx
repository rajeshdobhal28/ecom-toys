'use client';

import React, { useState } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { API, makeApiRequest } from '@/api/api';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const resp = await makeApiRequest(API.SUBMIT_CONTACT, formData);
            if (resp.status === 'success') {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error('Contact submission failed', err);
            setStatus('error');
        }
    };

    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Fancy Hero Section */}
                <section className={styles.heroSection}>
                    <div className={`container ${styles.heroContainer}`}>
                        <h1 className={styles.title}>We'd Love to Hear From You!</h1>
                        <p className={styles.subtitle}>
                            Whether you have a question about our toys, shipping, or anything else, our team is ready to answer all your questions.
                        </p>
                    </div>
                    {/* Decorative shapes to make it fancy */}
                    <div className={styles.blob1}></div>
                    <div className={styles.blob2}></div>
                </section>

                {/* Content Section */}
                <section className={styles.contentSection}>
                    <div className={`container ${styles.contentContainer}`}>

                        {/* Contact Info Cards */}
                        <div className={styles.infoCards}>
                            <div className={styles.card}>
                                <div className={styles.iconWrapper} style={{ backgroundColor: '#FFEAA7', color: '#FDCB6E' }}>
                                    <MapPin size={28} />
                                </div>
                                <h3>Our Location</h3>
                                <p>New Delhi India</p>
                            </div>

                            <div className={styles.card}>
                                <div className={styles.iconWrapper} style={{ backgroundColor: '#74B9FF', color: '#0984E3' }}>
                                    <Mail size={28} />
                                </div>
                                <h3>Email Us</h3>
                                <p>rkdobhal.business@gmail.com</p>
                            </div>

                            <div className={styles.card}>
                                <div className={styles.iconWrapper} style={{ backgroundColor: '#FF7675', color: '#D63031' }}>
                                    <Phone size={28} />
                                </div>
                                <h3>Call Us</h3>
                                <p>+91 7838943334<br />Mon-Fri, 9am - 6pm EST</p>
                            </div>

                            <div className={styles.card}>
                                <div className={styles.iconWrapper} style={{ backgroundColor: '#A29BFE', color: '#6C5CE7' }}>
                                    <Clock size={28} />
                                </div>
                                <h3>Business Hours</h3>
                                <p>Monday - Friday: 9am - 6pm<br />Weekend: 10am - 4pm</p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className={styles.formContainer}>
                            <div className={styles.formCard}>
                                <h2>Send Us a Message</h2>
                                {status === 'success' ? (
                                    <div className={styles.successMessage} style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f0fff4', borderRadius: '8px', border: '1px solid #c6f6d5' }}>
                                        <CheckCircle size={48} color="#48bb78" style={{ margin: '0 auto 16px' }} />
                                        <h3 style={{ color: '#2f855a', marginBottom: '8px' }}>Message Sent Successfully!</h3>
                                        <p style={{ color: '#276749' }}>Thank you for reaching out. We will get back to you shortly.</p>
                                        <button
                                            onClick={() => setStatus('idle')}
                                            className="btn btn-primary"
                                            style={{ marginTop: '20px' }}
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <form className={styles.form} onSubmit={handleSubmit}>
                                        <div className={styles.inputGroupRow}>
                                            <div className={styles.inputGroup}>
                                                <label htmlFor="name">Your Name</label>
                                                <input type="text" id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required disabled={status === 'loading'} />
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label htmlFor="email">Your Email</label>
                                                <input type="email" id="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required disabled={status === 'loading'} />
                                            </div>
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <label htmlFor="subject">Subject</label>
                                            <input type="text" id="subject" placeholder="How can we help?" value={formData.subject} onChange={handleChange} required disabled={status === 'loading'} />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <label htmlFor="message">Message</label>
                                            <textarea id="message" rows={5} placeholder="Write your message here..." value={formData.message} onChange={handleChange} required disabled={status === 'loading'}></textarea>
                                        </div>

                                        {status === 'error' && (
                                            <p style={{ color: '#e53e3e', fontSize: '14px', marginBottom: '16px' }}>Failed to send message. Please try again later.</p>
                                        )}

                                        <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={status === 'loading'}>
                                            <Send size={18} />
                                            {status === 'loading' ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
