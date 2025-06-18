import LoginForm from "@/components/auth/LoginForm";
import styles from "@/styles/auth/auth.module.css";

export default function LoginPage() {
    return (
        <main className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Entrar</h1>
                <LoginForm />
            </div>
        </main>
    );
}
