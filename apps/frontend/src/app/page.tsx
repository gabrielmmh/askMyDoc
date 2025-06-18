'use client';

import { useState } from 'react';
import Header from '@/components/home/Header';
import UploadForm from '@/components/home/UploadForm';
import DocumentList from '@/components/home/DocumentList';
import headerStyles from '@/styles/home/header.module.css';

export default function HomePage() {
  const [refresh, setRefresh] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const triggerRefresh = () => setRefresh(prev => !prev);

  const handleAuthChange = (logged: boolean) => {
    setIsLoggedIn(logged);
    triggerRefresh();
  };

  return (
    <main className={headerStyles.container}>
      <div className="bg-white rounded-xl shadow-lg p-10 w-full text-center space-y-6">
        <Header onAuthChange={handleAuthChange} />
        <h1 className="text-4xl font-bold text-gray-900 mb-6">AskMyDoc</h1>
        <p className="text-gray-700 text-lg">Carregue seu documento e tire dúvidas com a IA.</p>

        <UploadForm isLoggedIn={isLoggedIn} onDataChange={triggerRefresh} />
        <DocumentList refreshSignal={refresh} />
      </div>
    </main>
  );
}
