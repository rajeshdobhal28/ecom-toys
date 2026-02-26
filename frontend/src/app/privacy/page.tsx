import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './privacy.module.css';

export const metadata = {
    title: 'Privacy Policy | WonderToys',
    description: 'Learn how WonderToys collects, uses, and protects your data.',
};

export default function PrivacyPolicy() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={`container ${styles.container}`}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Privacy Policy</h1>
                        <p className={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className={styles.content}>
                        <p>
                            This Privacy Policy explains how we collect, use, and share your personal information when you visit or make a purchase from WonderToys.
                        </p>

                        <section className={styles.section}>
                            <h2>Information We Collect</h2>
                            <p>When you visit our website, we automatically collect certain details about your device, including:</p>
                            <ul>
                                <li>Your web browser, IP address, time zone, and cookies stored on your device.</li>
                                <li>Your browsing activity, such as product pages viewed and referral sources.</li>
                            </ul>
                            <p>We refer to this as <strong>“Device Information.”</strong></p>

                            <p>When you make a purchase, attempt to make a purchase, or create an account, we collect:</p>
                            <ul>
                                <li>Your name, billing and shipping addresses, payment details, email, and phone number.</li>
                                <li>
                                    <strong>Google Authentication Data:</strong> If you sign in via Google, we securely receive and store your Name, Email Address, and Profile Picture strictly to create your account and personalize your experience.
                                </li>
                            </ul>
                            <p>This is known as <strong>“Order and Account Information.”</strong></p>

                            <p>Together, we refer to Device Information and Order/Account Information as <strong>"Personal Information."</strong></p>
                        </section>

                        <section className={styles.section}>
                            <h2>How We Use Your Information</h2>
                            <p>We use the collected information to:</p>
                            <ul>
                                <li>Process and fulfill your orders, including payment handling and arranging shipments.</li>
                                <li>Source the toys you purchase from our curated market suppliers to fulfill your order.</li>
                                <li>Communicate with you regarding your purchase, shipping updates, or inquiries.</li>
                                <li>Screen transactions for potential fraud or security risks.</li>
                                <li>Maintain your user profile and identify your product reviews (using your Google profile data).</li>
                                <li>Improve our website’s performance and customer experience through analytics.</li>
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2>Sharing Your Information</h2>
                            <p>
                                We share your Personal Information with trusted third-party service providers to help operate our website, fulfill your orders, and source our inventory from the market. For instance:
                            </p>
                            <ul>
                                <li>We use third-party courier services to deliver products to your shipping address.</li>
                                <li>We may use analytics tools (like Google Analytics) to understand how our customers use WonderToys.</li>
                            </ul>
                            <p>We may also share information when required by law enforcement, legal requests, or to protect our rights.</p>
                        </section>

                        <section className={styles.section}>
                            <h2>Do Not Track</h2>
                            <p>We do not modify our data collection practices in response to Do Not Track signals from your browser.</p>
                        </section>

                        <section className={styles.section}>
                            <h2>Your Rights</h2>
                            <p>If you are a resident of certain jurisdictions, you have the right to:</p>
                            <ul>
                                <li>Access, update, or delete the personal information we hold about you.</li>
                                <li>Request that we delete your Google Single Sign-on data (Name and Profile Picture).</li>
                                <li>Request that we stop processing your data.</li>
                            </ul>
                            <p>To exercise these rights, please contact us at the email provided below.</p>
                        </section>

                        <section className={styles.section}>
                            <h2>Data Retention</h2>
                            <p>We retain your Order and Account Information for our records unless and until you ask us to delete this information.</p>
                        </section>

                        <section className={styles.section}>
                            <h2>Changes to This Policy</h2>
                            <p>We may update this privacy policy from time to time in order to reflect changes to our practices or for other operational, legal, or regulatory reasons.</p>
                        </section>

                        <section className={styles.section}>
                            <h2>Minors</h2>
                            <p>Our website is not intended for individuals under the age of 13. We do not intentionally collect personal information from children.</p>
                        </section>

                        <section className={styles.section}>
                            <h2>Contact Us</h2>
                            <p>
                                For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at:
                                <br />
                                📧 <strong>Email:</strong> privacy@wondertoys.com
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
