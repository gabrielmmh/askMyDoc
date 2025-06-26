'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/home/upload.module.css';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface UploadFormProps {
    onDataChange?: () => void;
    isLoggedIn: boolean;
}

export default function UploadForm({ onDataChange, isLoggedIn }: UploadFormProps) {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [ocrText, setOcrText] = useState('');
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [documentId, setDocumentId] = useState('');
    const [asking, setAsking] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = panelRef.current;
        if (!el) return;

        if (isExpanded) {
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
    }, [isExpanded]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setFile(e.target.files[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) return router.push('/auth/login');
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setOcrText('');
        setAnswer('');
        setQuestion('');
        setIsExpanded(false);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/documents/upload`,
                {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                }
            );
            const { documentId } = await res.json();
            if (!documentId) throw new Error('Erro ao processar o upload');
            setDocumentId(documentId);

            const ocrRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/ocr`,
                { method: 'POST', credentials: 'include' }
            );
            const { text } = await ocrRes.json();
            setOcrText(text || 'Nenhum texto extraído.');

            if (onDataChange) onDataChange();
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Erro desconhecido no upload do documento.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAsk = async () => {
        if (!question.trim() || !documentId) return;
        setAsking(true);
        setAnswer('');
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/ask`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question }),
                }
            );
            const { answer } = await res.json();
            setAnswer(answer || 'Sem resposta disponível.');
            if (onDataChange) onDataChange();
        } catch {
            setAnswer('Erro ao buscar resposta.');
        } finally {
            setAsking(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.wrapper}>
            <label className={styles.label}>Selecione um PDF ou imagem:</label>

            <div className={styles.uploadGroup}>
                <label htmlFor="file-upload" className={styles.uploadLabel}>
                    Escolher arquivo
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={handleFileChange}
                    className={styles.uploadInputHidden}
                />
                <span className={styles.uploadFilename}>
                    {file ? file.name : 'Nenhum arquivo escolhido'}
                </span>
            </div>

            <button type="submit" disabled={loading} className={styles.button}>
                {loading ? 'Enviando...' : 'Enviar documento'}
            </button>

            {ocrText && (
                <div className={styles.resultBox}>
                    <h2 className={styles.resultTitle}>Texto extraído</h2>
                    <button
                        type="button"
                        className={styles.toggleButton}
                        onClick={() => setIsExpanded((v) => !v)}
                    >
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </button>

                    <div ref={panelRef} style={{ overflow: 'hidden', height: 0 }}>
                        <div className={styles.answerText}>
                            <ReactMarkdown>{ocrText}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}

            {ocrText && (
                <div className={styles.askWrapper}>
                    <label htmlFor="question" className={styles.label}>
                        Pergunte algo sobre o documento
                    </label>
                    <textarea
                        id="question"
                        className={styles.askInput}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Digite sua pergunta aqui..."
                        rows={3}
                        maxLength={280}
                    />
                    <div className="mt-10">
                        <button
                            type="button"
                            onClick={handleAsk}
                            disabled={asking}
                            className={styles.button}
                        >
                            {asking ? 'Perguntando...' : 'Perguntar'}
                        </button>
                    </div>

                    {answer && (
                        <div className={styles.resultBox}>
                            <h3 className={styles.resultTitle}>Resposta</h3>
                            <div className={styles.answerText}>
                                <ReactMarkdown>{answer}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </form>
    );
}
