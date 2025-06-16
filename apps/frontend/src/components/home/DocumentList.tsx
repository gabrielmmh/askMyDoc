'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/home/documentList.module.css';

interface Interaction {
    id: string;
    question: string;
    answer: string;
}

interface DocumentItem {
    id: string;
    filename: string;
    createdAt: string;
    ocrResult?: { text: string };
    interactions: Interaction[];
}

interface Props {
    refreshSignal: boolean;
}

export default function DocumentList({ refreshSignal }: Props) {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
                    credentials: 'include',
                });
                const data = await res.json();
                console.log(data); // 👈 inspecione o conteúdo retornado
                setDocuments(data);
            } catch {
                alert('Erro ao carregar documentos');
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [refreshSignal]);

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Meus Documentos</h2>

            {loading ? (
                <p className={styles.loadingText}>Carregando...</p>
            ) : documents.length === 0 ? (
                <p className={styles.loadingText}>Nenhum documento enviado ainda.</p>
            ) : (
                documents.map((doc) => (
                    <div key={doc.id} className={styles.card}>
                        <p className={styles.filename}>{doc.filename}</p>
                        <p className={styles.createdAt}>
                            Enviado em: {new Date(doc.createdAt).toLocaleString()}
                        </p>

                        <div className={styles.ocrText}>
                            <strong>Texto extraído:</strong><br />
                            {doc.ocrResult?.content || 'Nenhum OCR disponível.'}
                        </div>

                        {doc.interactions.length > 0 && (
                            <div className={styles.interactions}>
                                <strong>Interações:</strong>
                                <ul className={styles.interactionsList}>
                                    {doc.interactions.map((inter) => (
                                        <li key={inter.id}>
                                            <strong>P:</strong> {inter.question}<br />
                                            <strong>R:</strong> {inter.answer}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <a
                            href={`${process.env.NEXT_PUBLIC_API_URL}/documents/${doc.id}/download`}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className={styles.downloadLink}
                        >
                            Baixar com anotações
                        </a>
                    </div>
                ))
            )}
        </div>
    );
}
