'use client';

import { useState } from 'react';
import uploadStyles from '@/styles/home/upload.module.css';

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [ocrText, setOcrText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setOcrText('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/upload`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const data = await response.json();
            console.log('UPLOAD RESPONSE:', data);

            if (!data.documentId) throw new Error('Erro ao processar o upload');

            const ocrResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${data.documentId}/ocr`, {
                method: 'POST',
                credentials: 'include',
            });

            const ocr = await ocrResponse.json();
            setOcrText(ocr.text || 'Nenhum texto extraído.');
        } catch (error: any) {
            alert(error.message || 'Erro no upload do documento.');
        } finally {
            setLoading(false);
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
                    <pre className="whitespace-pre-wrap">{ocrText}</pre>
                </div>
            )}
        </form>
    );
}
