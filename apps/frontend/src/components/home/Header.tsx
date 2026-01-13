'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/home/header.module.css';

type Props = {
    onAuthChange: (logged: boolean) => void;
};

export default function Header({ onAuthChange }: Props) {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const checkLogin = useCallback(async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                credentials: 'include',
            });
            const loggedIn = res.ok;
            setIsLoggedIn(loggedIn);
            onAuthChange(loggedIn);
        } catch {
            setIsLoggedIn(false);
            onAuthChange(false);
        }
    }, [onAuthChange]);

    useEffect(() => {
        checkLogin();
    }, [checkLogin]);

    const handleLogout = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            credentials: 'include',
        });
        setIsLoggedIn(false);
        onAuthChange(false);
        router.refresh();
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <span className={styles.logo}>AskMyDoc</span>
                <nav className={styles.nav}>
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className={styles.navButton}>
                            Sair
                        </button>
                    ) : (
                        <>
                            <button onClick={() => router.push('/auth/login')} className={styles.navButtonGhost}>
                                Entrar
                            </button>
                            <button onClick={() => router.push('/auth/register')} className={styles.navButtonPrimary}>
                                Criar conta
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
