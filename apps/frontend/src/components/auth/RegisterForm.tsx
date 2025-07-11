'use client';

import { useState } from "react";
import styles from "@/styles/auth/auth.module.css";
import GoogleButton from "@/components/auth/GoogleButton";
import Link from 'next/link';

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

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
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Erro desconhecido ao fazer cadastro.');
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
                <label className={styles.label}>Nome</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    required
                />
            </div>
            <div>
                <label className={styles.label}>E-mail</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />
            </div>
            <div>
                <label className={styles.label}>Senha</label>
                <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className={styles.input}
                    required
                />
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
                {loading ? 'Criando...' : 'Criar conta'}
            </button>

            <div className="flex justify-center mt-4">
                <GoogleButton onClick={handleGoogleLogin} mode="signup" />
            </div>

            <p className={styles.linkText}>
                Já tem uma conta?{' '}
                <Link href="login" className={styles.link}>Entrar</Link>
            </p>
        </form>
    );
}
