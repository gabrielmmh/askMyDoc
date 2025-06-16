'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/home/header.module.css';

type Props = {
    onAuthChange: (logged: boolean) => void;
};

export default function Header({ onAuthChange }: Props) {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const checkLogin = async () => {
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
        };
        checkLogin();
    }, []);

    const handleLogout = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            credentials: 'include',
        });
        setIsLoggedIn(false);
        onAuthChange(false);
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
                        Entrar
                    </button>
                    <button onClick={() => router.push('/auth/register')} className={styles.navButton}>
                        Criar conta
                    </button>
                </>
            )}
        </header>
    );
}
