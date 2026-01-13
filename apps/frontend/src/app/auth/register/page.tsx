import RegisterForm from "@/components/auth/RegisterForm";
import styles from "@/styles/auth/auth.module.css";

export default function RegisterPage() {
    return (
        <main className={styles.container}>
            <div className={styles.card}>
                <p className={styles.logo}>AskMyDoc</p>
                <h1 className={styles.title}>Criar conta</h1>
                <RegisterForm />
            </div>
        </main>
    );
}
