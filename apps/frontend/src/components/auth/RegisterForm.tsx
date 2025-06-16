'use client';

import { useState } from "react";
import styles from "@/styles/auth/register.module.css";

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Register:", { name, email, senha });
    };

    const handleGoogleLogin = () => {
        console.log("Google login");
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
                />
            </div>
            <div>
                <label className={styles.label}>E-mail</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                />
            </div>
            <div>
                <label className={styles.label}>Senha</label>
                <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className={styles.input}
                />
            </div>
            <button type="submit" className={styles.button}>
                Cadastrar
            </button>
            <div className={styles.linkText}>
                ou
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="ml-2 text-indigo-600 hover:underline"
                >
                    Entrar com Google
                </button>
            </div>
        </form>
    );
}
