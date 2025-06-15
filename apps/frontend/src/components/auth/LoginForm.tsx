'use client';

import { useState } from 'react';
import styles from '@/styles/auth/login.module.css';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login:', { email, senha });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div>
                <label htmlFor="email" className={styles.label}>Email</label>
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
                <label htmlFor="senha" className={styles.label}>Password</label>
                <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className={styles.input}
                    required
                />
            </div>

            <button type="submit" className={styles.button}>Login</button>

            <p className={styles.linkText}>
                Need to create an account?{' '}
                <a href="#" className={styles.link}>Create Account</a>
            </p>
        </form>
    );
}
