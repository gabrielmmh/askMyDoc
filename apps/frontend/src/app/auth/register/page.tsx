import RegisterForm from "@/components/auth/RegisterForm";
import styles from "@/styles/auth/auth.module.css";

export default function RegisterPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Criar conta</h1>
                <RegisterForm />
            </div>
        </div>
    );
}
