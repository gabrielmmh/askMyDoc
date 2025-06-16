'use client';

import { useState } from 'react';
import Header from '@/components/home/Header';
import UploadForm from '@/components/home/UploadForm';
import DocumentList from '@/components/home/DocumentList';
import headerStyles from '@/styles/home/header.module.css';

export default function HomePage() {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh(prev => !prev);

  return (
    <main className={headerStyles.container}>
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-4xl text-center space-y-6">
        <Header />
        <h1 className="text-4xl font-bold text-gray-900 mb-6">AskMyDoc</h1>
        <p className="text-gray-700 text-lg">Carregue seu documento e tire dúvidas com a IA.</p>

        <UploadForm onDataChange={triggerRefresh} />
        <DocumentList refreshSignal={refresh} />
      </div>
    </main>
  );
}
