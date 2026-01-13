'use client';

import { useEffect, useState, useRef } from 'react';
import styles from '@/styles/home/documentList.module.css';
import ReactMarkdown from 'react-markdown';
import { Trash2, DownloadCloud, ChevronDown, FileText, Check } from 'lucide-react';
import { ANIMATION } from '@/lib/constants';

interface Interaction {
    id: string;
    question: string;
    answer: string;
}

export interface DocumentItem {
    id: string;
    filename: string;
    createdAt: string;
    ocrResult?: { content: string };
    interactions: Interaction[];
}

interface DocumentCardProps {
    doc: DocumentItem;
    onDelete: () => void;
}

function animateCollapse(el: HTMLElement | null, expand: boolean): (() => void) | undefined {
    if (!el) return undefined;

    let onEnd: (() => void) | null = null;

    if (expand) {
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
}

export default function DocumentCard({ doc, onDelete }: DocumentCardProps) {
    const [textExpanded, setTextExpanded] = useState(false);
    const [interExpanded, setInterExpanded] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);
    const interRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        return animateCollapse(textRef.current, textExpanded);
    }, [textExpanded]);

    useEffect(() => {
        return animateCollapse(interRef.current, interExpanded);
    }, [interExpanded]);

    const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/documents/${doc.id}/download`;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.fileIcon}>
                    <FileText className="w-5 h-5" />
                </div>

                <div className={styles.fileInfo}>
                    <p className={styles.filename}>{doc.filename}</p>
                    <p className={styles.createdAt}>{formatDate(doc.createdAt)}</p>
                </div>

                {doc.ocrResult?.content && (
                    <span className={styles.statusBadge}>
                        <Check className="w-3 h-3" />
                        OCR
                    </span>
                )}

                <div className={styles.actions}>
                    <a
                        href={downloadUrl}
                        download
                        className={styles.iconButton}
                        aria-label="Baixar com anotações"
                    >
                        <DownloadCloud className="w-5 h-5" />
                    </a>

                    <button
                        onClick={onDelete}
                        className={styles.iconButton}
                        aria-label="Excluir documento"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2">
                <span className={styles.sectionTitle} id={`text-heading-${doc.id}`}>
                    Texto extraído
                </span>
                <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={() => setTextExpanded((v) => !v)}
                    aria-expanded={textExpanded}
                    aria-controls={`text-panel-${doc.id}`}
                    aria-label={textExpanded ? 'Recolher texto extraído' : 'Expandir texto extraído'}
                >
                    <ChevronDown className={`chevron-icon ${textExpanded ? 'chevron-expanded' : ''}`} />
                </button>
            </div>
            <div id={`text-panel-${doc.id}`} ref={textRef} style={{ overflow: 'hidden', height: 0 }} aria-labelledby={`text-heading-${doc.id}`}>
                <div className={styles.ocrText}>
                    {doc.ocrResult?.content || 'Nenhum OCR disponível.'}
                </div>
            </div>

            {doc.interactions.length > 0 && (
                <>
                    <div className="flex items-center justify-between pt-2">
                        <span className={styles.sectionTitle} id={`inter-heading-${doc.id}`}>
                            Interações ({doc.interactions.length})
                        </span>
                        <button
                            type="button"
                            className={styles.toggleButton}
                            onClick={() => setInterExpanded((v) => !v)}
                            aria-expanded={interExpanded}
                            aria-controls={`inter-panel-${doc.id}`}
                            aria-label={interExpanded ? 'Recolher interações' : 'Expandir interações'}
                        >
                            <ChevronDown className={`chevron-icon ${interExpanded ? 'chevron-expanded' : ''}`} />
                        </button>
                    </div>
                    <div id={`inter-panel-${doc.id}`} ref={interRef} style={{ overflow: 'hidden', height: 0 }} aria-labelledby={`inter-heading-${doc.id}`}>
                        <div className="space-y-4">
                            {doc.interactions.map((inter) => (
                                <div key={inter.id} className={styles.interactionsList}>
                                    <p className="font-medium text-slate-900">Pergunta</p>
                                    <div className={styles.ocrText}>{inter.question}</div>
                                    <p className="font-medium text-slate-900 mt-2">Resposta</p>
                                    <div className={styles.ocrText}>
                                        <ReactMarkdown>{inter.answer}</ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
