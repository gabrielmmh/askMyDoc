'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/home/header.module.css';

export default function Header() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    setIsLoggedIn(true);
                }
            } catch {
                setIsLoggedIn(false);
            }
        };
        checkLogin();
    }, []);

    const handleLogout = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            credentials: 'include',
        });
        setIsLoggedIn(false);
        router.refresh(); 
    };

    return (
        <header className="flex justify-end space-x-4 mb-8">
            {isLoggedIn ? (
                <button onClick={handleLogout} className={styles.navButton}>
                    Leave
                </button>
            ) : (
                <>
                    <button onClick={() => router.push('/auth/login')} className={styles.navButton}>
                        Login
                    </button>
                        <button onClick={() => router.push('/auth/register')} className={styles.navButton}>
                        Register
                    </button>
                </>
            )}
        </header>
    );
}
