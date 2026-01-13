'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/home/upload.module.css';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, Upload } from 'lucide-react';
import { ANIMATION, UI } from '@/lib/constants';

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
    const [isDragging, setIsDragging] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = panelRef.current;
        if (!el) return;

        let onEnd: (() => void) | null = null;

        if (isExpanded) {
            el.style.height = '0px';
            requestAnimationFrame(() => {
                el.style.transition = `height ${ANIMATION.COLLAPSE_DURATION_MS}ms ease`;
                el.style.height = `${el.scrollHeight}px`;
            });
            onEnd = () => {
                el.style.height = 'auto';
                el.removeEventListener('transitionend', onEnd!);
            };
            el.addEventListener('transitionend', onEnd);
        } else {
            const current = el.getBoundingClientRect().height;
            el.style.height = `${current}px`;
            requestAnimationFrame(() => {
                el.style.transition = `height ${ANIMATION.COLLAPSE_DURATION_MS}ms ease`;
                el.style.height = '0px';
            });
        }

        return () => {
            if (onEnd && el) {
                el.removeEventListener('transitionend', onEnd);
            }
        };
    }, [isExpanded]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setFile(e.target.files[0]);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            const isValidType = droppedFile.type === 'application/pdf' || droppedFile.type.startsWith('image/');
            if (isValidType) {
                setFile(droppedFile);
            }
        }
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

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Erro HTTP ${res.status}`);
            }

            const { documentId } = await res.json();
            if (!documentId) throw new Error('Erro ao processar o upload');
            setDocumentId(documentId);

            const ocrRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/ocr`,
                { method: 'POST', credentials: 'include' }
            );

            if (!ocrRes.ok) {
                const errorText = await ocrRes.text();
                throw new Error(errorText || `Erro HTTP ${ocrRes.status} no OCR`);
            }

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

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Erro HTTP ${res.status}`);
            }

            const { answer } = await res.json();
            setAnswer(answer || 'Sem resposta disponível.');
            if (onDataChange) onDataChange();
        } catch (error: unknown) {
            if (error instanceof Error) {
                setAnswer(`Erro: ${error.message}`);
            } else {
                setAnswer('Erro ao buscar resposta.');
            }
        } finally {
            setAsking(false);
        }
    };

    const getDropzoneClassName = () => {
        let className = styles.dropzone;
        if (isDragging) className += ` ${styles.dropzoneDragging}`;
        else if (file) className += ` ${styles.dropzoneHasFile}`;
        return className;
    };

    return (
        <form onSubmit={handleSubmit} className={styles.wrapper}>
            <div
                className={getDropzoneClassName()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
            >
                <Upload className={styles.dropzoneIcon} />
                <p className={styles.dropzoneText}>
                    {file ? 'Arquivo selecionado' : 'Arraste seu arquivo aqui'}
                </p>
                <p className={styles.dropzoneSubtext}>
                    {file ? '' : 'ou clique para selecionar'}
                </p>
                <input
                    id="file-upload"
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={handleFileChange}
                    className={styles.uploadInputHidden}
                />
                {!file && (
                    <span className={styles.uploadLabel}>
                        Escolher arquivo
                    </span>
                )}
                {file && (
                    <p className={styles.dropzoneFilename}>{file.name}</p>
                )}
            </div>

            <button type="submit" disabled={loading || !file} className={styles.button}>
                {loading && <span className="spinner" />}
                {loading ? 'Enviando...' : 'Enviar documento'}
            </button>

            {ocrText && (
                <div className={styles.resultBox}>
                    <div className="flex items-center justify-between">
                        <h2 id="ocr-text-heading" className={styles.resultTitle}>Texto extraído</h2>
                        <button
                            type="button"
                            className={styles.toggleButton}
                            onClick={() => setIsExpanded((v) => !v)}
                            aria-expanded={isExpanded}
                            aria-controls="ocr-text-panel"
                            aria-label={isExpanded ? 'Recolher texto extraído' : 'Expandir texto extraído'}
                        >
                            <ChevronDown className={`chevron-icon ${isExpanded ? 'chevron-expanded' : ''}`} />
                        </button>
                    </div>

                    <div id="ocr-text-panel" ref={panelRef} style={{ overflow: 'hidden', height: 0 }} aria-labelledby="ocr-text-heading">
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
                        maxLength={UI.MAX_QUESTION_LENGTH}
                    />
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleAsk}
                            disabled={asking}
                            className={styles.button}
                        >
                            {asking && <span className="spinner" />}
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
