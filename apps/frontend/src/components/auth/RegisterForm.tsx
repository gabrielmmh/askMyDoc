'use client';

import { useState } from "react";
import styles from "@/styles/auth/register.module.css";
import GoogleButton from "@/components/GoogleButton";

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password: senha }),
                credentials: 'include',
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Erro no cadastro');
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
                <label className={styles.label}>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    required
                />
            </div>
            <div>
                <label className={styles.label}>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />
            </div>
            <div>
                <label className={styles.label}>Password</label>
                <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className={styles.input}
                    required
                />
            </div>
            <button type="submit" className={styles.button}>
                Sign up
            </button>

            <div className="flex justify-center mt-4">
                <GoogleButton onClick={handleGoogleLogin} mode="signup" />
            </div>

            <p className={styles.linkText}>
                Already have an account?{' '}
                <a href="/auth/login" className={styles.link}>Sign in</a>
            </p>
        </form>
    );
}
