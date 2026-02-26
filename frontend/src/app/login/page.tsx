'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
// import { useSearchParams } from "next/navigation";
import { API, makeApiRequest } from '../../api/api';
import styles from './login.module.css';
import React, { useEffect, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'next/navigation';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/shop';
  const { user, checkUser } = useAuth();

  useEffect(() => {
    if (user?.email) {
      router.push(redirectUrl);
    }
  }, [user, router, redirectUrl]);

  const handleSuccess = async (credentialResponse: any) => {
    console.log('Login Success:', credentialResponse);
    const resp = await makeApiRequest(API.GOOGLE_LOGIN, {
      token: credentialResponse.credential,
    });
    console.log('Login Response:', resp);
    if (resp.status === 'success') {
      await checkUser();
      router.push(redirectUrl);
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
            <a href="/terms" className={styles.link}>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className={styles.link}>
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className={styles.container} style={{ justifyContent: 'center' }}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
