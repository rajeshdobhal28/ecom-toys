'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
// import { useSearchParams } from "next/navigation";
import { API, makeApiRequest } from '../../api/api';
import styles from './login.module.css';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  // const searchParams = useSearchParams();
  // const error = searchParams.get("error"); // In case we want to handle errors from other flows later

  useEffect(() => {
    if (user?.email) {
      router.push('/shop');
    }
  }, [user]);

  const handleSuccess = async (credentialResponse: any) => {
    console.log('Login Success:', credentialResponse);
    const resp = await makeApiRequest(API.GOOGLE_LOGIN, {
      token: credentialResponse.credential,
    });
    console.log('Login Response:', resp);
    if (resp.status === 'success') {
      router.push('/shop');
    }
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div className={styles.container}>
      <div className={styles.brandSection}>
        <div className={styles.decorationCircle1} />
        <div className={styles.decorationCircle2} />
        <div className={styles.brandContent}>
          <h1 className={styles.logo}>WonderToys</h1>
          <p className={styles.tagline}>
            Discover the magic of play with our curated collection of
            educational and fun toys for every child.
          </p>
        </div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formCard}>
          <h2 className={styles.welcomeTitle}>Welcome Back</h2>
          <p className={styles.welcomeSubtitle}>
            Sign in to continue to WonderToys
          </p>

          <div className={styles.googleBtnWrapper}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
              shape="pill"
              theme="outline"
              size="large"
              width="280"
              text="continue_with"
            />
          </div>

          <p className={styles.terms}>
            By signing in, you agree to our{' '}
            <a href="#" className={styles.link}>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className={styles.link}>
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
