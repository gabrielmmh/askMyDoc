'use client';

import { useState } from 'react';
import styles from '@/styles/auth/login.module.css';
import GoogleButton from '@/components/auth/GoogleButton';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

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
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
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

            <button type="submit" className={styles.button}>Entrar</button>

            <div className="flex justify-center mt-4">
                <GoogleButton onClick={handleGoogleLogin} mode="signin" />
            </div>

            <p className={styles.linkText}>
                Ainda não tem uma conta?{' '}
                <a href="register" className={styles.link}>Criar conta</a>
            </p>
        </form>
    );
}
