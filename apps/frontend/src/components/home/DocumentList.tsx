'use client';

import { useEffect, useState, useRef } from 'react';
import styles from '@/styles/home/documentList.module.css';
import ReactMarkdown from 'react-markdown';
import { Trash2, DownloadCloud, ChevronDown, ChevronUp } from 'lucide-react';

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
                if (!res.ok || !Array.isArray(data)) {
                    console.error('Formato inesperado ou erro:', data);
                    setDocuments([]);
                } else {
                    setDocuments(data);
                }
            } catch (err) {
                console.error('Erro ao carregar documentos:', err);
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

function DocumentCard({
    doc,
    onDelete,
}: {
    doc: DocumentItem;
    onDelete: () => void;
}) {
    const [textExpanded, setTextExpanded] = useState(false);
    const [interExpanded, setInterExpanded] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);
    const interRef = useRef<HTMLDivElement>(null);

    useEffect(() => animateCollapse(textRef.current, textExpanded), [textExpanded]);
    useEffect(() => animateCollapse(interRef.current, interExpanded), [interExpanded]);

    const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/documents/${doc.id}/download`;

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <p className={styles.filename}>{doc.filename}</p>

                <div className={styles.headerButtons}>
                    <a
                        href={downloadUrl}
                        download
                        className={styles.iconButton}
                        aria-label="Baixar com anotações"
                    >
                        <DownloadCloud />
                    </a>

                    <button
                        onClick={onDelete}
                        className={styles.iconButton}
                        aria-label="Excluir documento"
                    >
                        <Trash2 />
                    </button>
                </div>
            </div>

            <p className={styles.createdAt}>
                Enviado em: {new Date(doc.createdAt).toLocaleString()}
            </p>

            <strong className='block'>Texto extraído</strong>
            <button
                type="button"
                className={styles.toggleButton}
                onClick={() => setTextExpanded((v) => !v)}
            >
                {textExpanded ? <ChevronUp /> : <ChevronDown />}
            </button>
            <div ref={textRef} style={{ overflow: 'hidden', height: 0 }}>
                <div className={styles.ocrText}>
                    {doc.ocrResult?.content || 'Nenhum OCR disponível.'}
                </div>
            </div>

            {doc.interactions.length > 0 && (
                <>
                    <strong className={styles.interactions}>Interações</strong>
                    <button
                        type="button"
                        className={styles.toggleButton}
                        onClick={() => setInterExpanded((v) => !v)}
                    >
                        {interExpanded ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    <div ref={interRef} style={{ overflow: 'hidden', height: 0 }}>
                        {doc.interactions.map((inter) => (
                            <div key={inter.id} className={styles.interactionsList}>
                                <p><strong>Pergunta</strong></p>
                                <div className={styles.ocrText}>{inter.question}</div>
                                <p><strong>Resposta</strong></p>
                                <div className={styles.ocrText}>
                                    <ReactMarkdown>{inter.answer}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function animateCollapse(el: HTMLElement | null, expand: boolean) {
    if (!el) return;
    if (expand) {
        el.style.height = '0px';
        requestAnimationFrame(() => {
            el.style.transition = 'height 300ms ease';
            el.style.height = `${el.scrollHeight}px`;
        });
        const onEnd = () => {
            el.style.height = 'auto';
            el.removeEventListener('transitionend', onEnd);
        };
        el.addEventListener('transitionend', onEnd);
    } else {
        const current = el.getBoundingClientRect().height;
        el.style.height = `${current}px`;
        requestAnimationFrame(() => {
            el.style.transition = 'height 300ms ease';
            el.style.height = '0px';
        });
    }
}
