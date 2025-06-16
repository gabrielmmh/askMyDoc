'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import uploadStyles from '@/styles/home/upload.module.css';

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) {
            router.push('/auth/login');
            return;
        }

        if (!file) return;

        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setOcrText('');
        setAnswer('');
        setQuestion('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/upload`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const data = await response.json();
            if (!data.documentId) throw new Error('Erro ao processar o upload');

            setDocumentId(data.documentId);

            const ocrResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${data.documentId}/ocr`, {
                method: 'POST',
                credentials: 'include',
            });

            const ocr = await ocrResponse.json();
            setOcrText(ocr.text || 'Nenhum texto extraído.');
            
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/ask`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question }),
            });

            const data = await response.json();
            setAnswer(data.answer || 'Sem resposta disponível.');

            if (onDataChange) onDataChange();
        } catch {
            setAnswer('Erro ao buscar resposta.');
        } finally {
            setAsking(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={uploadStyles.wrapper}>
            <label className={uploadStyles.label}>Selecione um PDF:</label>
            <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                className={uploadStyles.fileInput}
            />
            <button
                type="submit"
                disabled={loading}
                className={uploadStyles.button}
            >
                {loading ? 'Enviando...' : 'Enviar documento'}
            </button>

            {ocrText && (
                <div className={uploadStyles.resultBox}>
                    <h2 className={uploadStyles.resultTitle}>Texto extraído:</h2>
                    <pre className={uploadStyles.answerText}>{ocrText}</pre>
                </div>
            )}

            {ocrText && (
                <div className={uploadStyles.askWrapper}>
                    <label htmlFor="question" className={uploadStyles.label}>
                        Pergunte algo sobre o documento:
                    </label>
                    <textarea
                        id="question"
                        className={uploadStyles.askInput}
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
                            className={uploadStyles.button}
                        >
                            {asking ? 'Perguntando...' : 'Perguntar'}
                        </button>
                    </div>

                    {answer && (
                        <div className={uploadStyles.resultBox}>
                            <h3 className={uploadStyles.resultTitle}>Resposta:</h3>
                            <p className={uploadStyles.answerText}>{answer}</p>
                        </div>
                    )}
                </div>
            )}

        </form>
    );
}
