import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function Contact() {
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
                                <form className={styles.form}>
                                    <div className={styles.inputGroupRow}>
                                        <div className={styles.inputGroup}>
                                            <label htmlFor="name">Your Name</label>
                                            <input type="text" id="name" placeholder="John Doe" required />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label htmlFor="email">Your Email</label>
                                            <input type="email" id="email" placeholder="john@example.com" required />
                                        </div>
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label htmlFor="subject">Subject</label>
                                        <input type="text" id="subject" placeholder="How can we help?" required />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label htmlFor="message">Message</label>
                                        <textarea id="message" rows={5} placeholder="Write your message here..." required></textarea>
                                    </div>

                                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                                        <Send size={18} />
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
