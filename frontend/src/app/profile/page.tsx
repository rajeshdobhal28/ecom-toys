import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProfileContent from '@/components/Profile/ProfileContent';
import styles from './page.module.css';

export default function ProfilePage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className="container">
                    <h1 className={styles.title}>My Profile</h1>
                    <ProfileContent />
                </div>
            </main>
            <Footer />
        </>
    );
}
