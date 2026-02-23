import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';
import { Video, ShieldAlert, PackageCheck, AlertCircle } from 'lucide-react';

export default function ReturnPolicy() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Fancy Hero Section */}
                <section className={styles.heroSection}>
                    <div className={`container ${styles.heroContainer}`}>
                        <h1 className={styles.title}>Returns & Refunds Policy</h1>
                        <p className={styles.subtitle}>
                            We want you to be completely happy with every toy. For transparency and fairness, please carefully review our return conditions below.
                        </p>
                    </div>
                    {/* Decorative shapes to make it fancy */}
                    <div className={styles.blob1}></div>
                    <div className={styles.blob2}></div>
                </section>

                {/* Content Section */}
                <section className={styles.contentSection}>
                    <div className={`container ${styles.contentContainer}`}>

                        {/* The Golden Rule Card (Highlighted) */}
                        <div className={`${styles.card} ${styles.highlightCard}`}>
                            <div className={styles.iconWrapper} style={{ backgroundColor: '#FF7675', color: '#FFF' }}>
                                <Video size={36} />
                            </div>
                            <h2>Strict Video Proof Required</h2>
                            <p className={styles.highlightText}>
                                To be eligible for a return or replacement, you <strong>must provide an uncut, unedited video</strong> of the product unboxing right from the sealed package.
                                <br /><br />
                                The video must clearly show the shipping label, the opening of the package, and the specific issue or defect in the toy in one continuous shot. <strong>Without this, no return requests will be accepted.</strong>
                            </p>
                        </div>

                        {/* Other Policy Rules */}
                        <div className={styles.rulesGrid}>
                            <div className={styles.card}>
                                <div className={styles.iconWrapper} style={{ backgroundColor: '#FFEAA7', color: '#FDCB6E' }}>
                                    <AlertCircle size={28} />
                                </div>
                                <h3>Valid Reasons for Return</h3>
                                <p>We accept returns for products that are physically damaged during transit, missing parts/accessories, or if you received an entirely wrong item.</p>
                            </div>

                            <div className={styles.card}>
                                <div className={styles.iconWrapper} style={{ backgroundColor: '#74B9FF', color: '#0984E3' }}>
                                    <ShieldAlert size={28} />
                                </div>
                                <h3>Timeline</h3>
                                <p>You must report the issue and submit the video proof to us via email within <strong>48 hours</strong> of the delivery timestamp. Late requests are declined.</p>
                            </div>

                            <div className={styles.card}>
                                <div className={styles.iconWrapper} style={{ backgroundColor: '#A29BFE', color: '#6C5CE7' }}>
                                    <PackageCheck size={28} />
                                </div>
                                <h3>Original Packaging</h3>
                                <p>The product must be returned with all original tags, manuals, accessories, and the original manufacturer packaging intact.</p>
                            </div>
                        </div>

                        {/* Steps to Return */}
                        <div className={styles.stepsContainer}>
                            <h2>How to Request a Return</h2>
                            <ol className={styles.stepsList}>
                                <li><strong>Record the Unboxing:</strong> Film the entire unpacking process without pauses or cuts, ensuring the label and issue are visible.</li>
                                <li><strong>Email Us:</strong> Send an email to <code>rkdobhal.business@gmail.com</code> with your Order ID, a brief description of the issue, and the video attachment (or a Google Drive link to the video).</li>
                                <li><strong>Review:</strong> Our support team will review the uncut footage within 24-48 hours.</li>
                                <li><strong>Approval & Shipping:</strong> Once approved, we will provide instructions for reverse pickup or returning the item to our warehouse.</li>
                                <li><strong>Refund/Replacement:</strong> Upon receiving and inspecting the returned item, we will issue a replacement or a full refund to your original payment method.</li>
                            </ol>
                        </div>

                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
