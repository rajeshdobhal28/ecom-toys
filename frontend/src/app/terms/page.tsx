import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './terms.module.css';

export const metadata = {
    title: 'Terms of Service | WonderToys',
    description: 'Read the terms of service that govern your use of WonderToys.',
};

export default function TermsOfService() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={`container ${styles.container}`}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Terms of Service</h1>
                        <p className={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className={styles.content}>
                        <section className={styles.section}>
                            <h2>1. Overview</h2>
                            <p>
                                This website is operated by WonderToys. Throughout the site, the terms "we," "us," and "our" refer to WonderToys.
                                By accessing or using this website, you engage in our “Service” and agree to be bound by these Terms of Service.
                            </p>
                            <p>
                                These terms apply to all users of the site, including without limitation users who are browsers, vendors, customers,
                                merchants, and/ or contributors of content. If you do not agree to all the terms and conditions of this agreement,
                                then you may not access the website or use any services.
                            </p>
                            <p>
                                We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes
                                to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access
                                to the website following the posting of any changes constitutes acceptance of those changes.
                            </p>
                        </section>

                        <section className={styles.section}>
                            <h2>2. Online Store Terms</h2>
                            <ul>
                                <li>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.</li>
                                <li>You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).</li>
                                <li>You must not transmit any worms or viruses or any code of a destructive nature.</li>
                                <li>A breach or violation of any of the Terms will result in an immediate termination of your Services.</li>
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2>3. Accuracy of Information</h2>
                            <ul>
                                <li>We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information.</li>
                                <li>Any reliance on the material on this site is at your own risk.</li>
                                <li>We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site.</li>
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2>4. Modifications & Pricing</h2>
                            <ul>
                                <li>Prices for our products are subject to change without notice.</li>
                                <li>We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</li>
                                <li>We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.</li>
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2>5. Products & Services</h2>
                            <ul>
                                <li>Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.</li>
                                <li>We have made every effort to display as accurately as possible the colors and images of our products that appear at the store.</li>
                                <li>We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region or jurisdiction.</li>
                                <li>We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations.</li>
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2>6. Billing & Account Information</h2>
                            <ul>
                                <li>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.</li>
                                <li>In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.</li>
                                <li>You agree to provide current, complete and accurate purchase and account information for all purchases made at our store.</li>
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2>7. Third-Party Tools & Links</h2>
                            <ul>
                                <li>We may provide you with access to third-party tools over which we neither monitor nor have any control nor input.</li>
                                <li>You acknowledge and agree that we provide access to such tools ”as is” and “as available” without any warranties, representations or conditions of any kind.</li>
                                <li>Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy.</li>
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2>8. User Comments & Feedback</h2>
                            <ul>
                                <li>If, at our request, you send certain specific submissions or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us.</li>
                                <li>We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion are unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party’s intellectual property or these Terms of Service.</li>
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2>9. Personal Information</h2>
                            <p>Your submission of personal information through the store is governed by our Privacy Policy.</p>
                        </section>

                        <section className={styles.section}>
                            <h2>10. Errors, Inaccuracies & Omissions</h2>
                            <ul>
                                <li>Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability.</li>
                                <li>We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information in the Service or on any related website is inaccurate at any time without prior notice.</li>
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2>11. Prohibited Uses</h2>
                            <p>In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content:</p>
                            <ul>
                                <li>for any unlawful purpose;</li>
                                <li>to solicit others to perform or participate in any unlawful acts;</li>
                                <li>to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances;</li>
                                <li>to infringe upon or violate our intellectual property rights or the intellectual property rights of others;</li>
                                <li>to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability;</li>
                                <li>to submit false or misleading information;</li>
                                <li>to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related website, other websites, or the Internet.</li>
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2>12. Disclaimer & Limitation of Liability</h2>
                            <ul>
                                <li>We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free.</li>
                                <li>In no case shall WonderToys, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.</li>
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2>13. Indemnification</h2>
                            <p>
                                You agree to indemnify, defend and hold harmless WonderToys and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys’ fees, made by any third-party due to or arising out of your breach of these Terms of Service.
                            </p>
                        </section>

                        <section className={styles.section}>
                            <h2>14. Severability</h2>
                            <p>
                                In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law.
                            </p>
                        </section>

                        <section className={styles.section}>
                            <h2>15. Termination</h2>
                            <ul>
                                <li>The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes.</li>
                                <li>These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services.</li>
                                <li>If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of these Terms of Service, we also may terminate this agreement at any time without notice.</li>
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2>16. Entire Agreement</h2>
                            <p>
                                The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision. These Terms of Service and any policies or operating rules posted by us on this site or in respect to The Service constitutes the entire agreement and understanding between you and us.
                            </p>
                        </section>

                        <section className={styles.section}>
                            <h2>17. Governing Law</h2>
                            <p>
                                These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of your jurisdiction.
                            </p>
                        </section>

                        <section className={styles.section}>
                            <h2>18. Changes to Terms</h2>
                            <p>
                                You can review the most current version of the Terms of Service at any time at this page. We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website.
                            </p>
                        </section>

                        <section className={styles.section}>
                            <h2>19. Contact Information</h2>
                            <p>
                                Questions about the Terms of Service should be sent to us at:
                                <br />
                                📧 <strong>Email:</strong> support@wondertoys.com
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
