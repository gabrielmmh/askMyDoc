'use client';

import { useState } from 'react';
import styles from '@/styles/auth/auth.module.css';
import GoogleButton from '@/components/auth/GoogleButton';
import Link from 'next/link';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: senha }),
                credentials: 'include',
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Erro ao fazer login');
            }

            window.location.href = '/';
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Erro desconhecido ao fazer login.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        const base = process.env.NEXT_PUBLIC_API_URL!;
        const url = new URL('/auth/google', base);
        window.open(url.toString(), '_self');
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div>
                <label htmlFor="email" className={styles.label}>E-mail</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />
            </div>

            <div>
                <label htmlFor="senha" className={styles.label}>Senha</label>
                <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className={styles.input}
                    required
                />
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="flex justify-center mt-4">
                <GoogleButton onClick={handleGoogleLogin} mode="signin" />
            </div>

            <p className={styles.linkText}>
                Ainda não tem uma conta?{' '}
                <Link href="register" className={styles.link}>Criar conta</Link>
            </p>
        </form>
    );
}
