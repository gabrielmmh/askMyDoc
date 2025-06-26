'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/home/documentList.module.css';
import ReactMarkdown from 'react-markdown';
import { Trash2 } from 'lucide-react';

interface Interaction {
    id: string;
    question: string;
    answer: string;
}

interface DocumentItem {
    id: string;
    filename: string;
    createdAt: string;
    ocrResult?: { content: string };
    interactions: Interaction[];
}

interface Props {
    refreshSignal: boolean;
}

export default function DocumentList({ refreshSignal }: Props) {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [modalMount, setModalMount] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
                    credentials: 'include',
                });
                const data = await res.json();

                if (!res.ok) {
                    console.error('Erro ao buscar documentos:', data);
                    setDocuments([]);
                    return;
                }

                if (Array.isArray(data)) {
                    setDocuments(data);
                } else {
                    console.error('Formato inesperado:', data);
                    setDocuments([]);
                }
            } catch (err) {
                console.error('Erro na requisição:', err);
                alert('Erro ao carregar documentos');
                setDocuments([]);
            } finally {
                setLoading(false);
            }  
        };

        fetchDocuments();
    }, [refreshSignal]);

    const handleOpen = (doc: DocumentItem) => {
        setDocToDelete(doc);
        setModalMount(true);
        setTimeout(() => setIsModalVisible(true), 10);
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setTimeout(() => {
            setModalMount(false);
            setDocToDelete(null);
        }, 300);
    };

    const handleDelete = async () => {
        if (!docToDelete) return;
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/documents/${docToDelete.id}`,
                { method: 'DELETE', credentials: 'include' }
            );
            if (!res.ok) throw new Error();
            setDocuments(docs => docs.filter(d => d.id !== docToDelete.id));
            handleClose();
        } catch {
            alert('Erro ao excluir. Tente novamente.');
        }
    };

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
                        <div className={styles.header}>
                            <p className={styles.filename}>{doc.filename}</p>
                            <button
                                onClick={() => handleOpen(doc)}
                                className='text-black border-none bg-transparent cursor-auto hover:text-amber-600 transition duration-500'
                                aria-label="Excluir documento"
                            >
                                <Trash2/>
                            </button>
                        </div>

                        <p className={styles.createdAt}>
                            Enviado em: {new Date(doc.createdAt).toLocaleString()}
                        </p>

                        <div className={styles.ocrText}>
                            <strong>Texto extraído:</strong>
                            <br />
                            {doc.ocrResult?.content || 'Nenhum OCR disponível.'}
                        </div>

                        {doc.interactions.length > 0 && (
                            <div className={styles.interactions}>
                                <strong>Interações:</strong>

                                {doc.interactions.map((inter) => (
                                    <div key={inter.id} className={styles.interactionsList}>
                                        <p><strong>Pergunta</strong></p>
                                        <div className={styles.ocrText}>
                                            <p>{inter.question}</p>
                                        </div>
                                        <p><strong>Resposta</strong></p>
                                        <div className={styles.ocrText}>
                                            <ReactMarkdown>{inter.answer}</ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
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

            {modalMount && (
                <div
                    className={
                        `${styles.modalOverlay} ` +
                        (isModalVisible ? styles.modalOverlayVisible : '')
                    }
                >
                    <div
                        className={
                            `${styles.modal} ` +
                            (isModalVisible ? styles.modalVisible : '')
                        }
                    >
                        <p>
                            Tem certeza que deseja excluir{' '}
                            <strong>{docToDelete?.filename}</strong>?
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                onClick={handleDelete}
                                className={styles.confirmDelete}
                            >
                                Excluir
                            </button>
                            <button onClick={handleClose} className={styles.cancel}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
