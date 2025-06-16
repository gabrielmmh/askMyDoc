import RegisterForm from "@/components/auth/RegisterForm";
import styles from "@/styles/auth/register.module.css";

export default function RegisterPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Cadastre-se</h1>
                <RegisterForm />
            </div>
        </div>
    );
}
