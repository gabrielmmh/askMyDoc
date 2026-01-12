'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/home/documentList.module.css';
import DocumentCard, { DocumentItem } from './DocumentCard';
import { ANIMATION } from '@/lib/constants';

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
        const controller = new AbortController();

        const fetchDocuments = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
                    credentials: 'include',
                    signal: controller.signal,
                });
                const data = await res.json();
                if (!res.ok || !Array.isArray(data)) {
                    console.error('Formato inesperado ou erro:', data);
                    setDocuments([]);
                } else {
                    setDocuments(data);
                }
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    return;
                }
                console.error('Erro ao carregar documentos:', err);
                setDocuments([]);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };
        fetchDocuments();

        return () => controller.abort();
    }, [refreshSignal]);

    const handleOpen = (doc: DocumentItem) => {
        setDocToDelete(doc);
        setModalMount(true);
        setTimeout(() => setIsModalVisible(true), ANIMATION.REFLOW_DELAY_MS);
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setTimeout(() => {
            setModalMount(false);
            setDocToDelete(null);
        }, ANIMATION.MODAL_CLOSE_DELAY_MS);
    };

    const handleDelete = async () => {
        if (!docToDelete) return;
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/documents/${docToDelete.id}`,
                { method: 'DELETE', credentials: 'include' }
            );
            if (!res.ok) throw new Error();
            setDocuments((docs) => docs.filter((d) => d.id !== docToDelete.id));
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
                    <DocumentCard
                        key={doc.id}
                        doc={doc}
                        onDelete={() => handleOpen(doc)}
                    />
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
