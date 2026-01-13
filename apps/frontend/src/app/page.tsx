'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/home/Header';
import UploadForm from '@/components/home/UploadForm';
import DocumentList from '@/components/home/DocumentList';
import "./globals.css";

export default function HomePage() {
  const [refresh, setRefresh] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const triggerRefresh = useCallback(() => setRefresh(prev => !prev), []);

  const handleAuthChange = useCallback((logged: boolean) => {
    setIsLoggedIn(logged);
    triggerRefresh();
  }, [triggerRefresh]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onAuthChange={handleAuthChange} />

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            AskMyDoc
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Carregue seu documento e tire dúvidas com inteligência artificial
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none" />
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <UploadForm isLoggedIn={isLoggedIn} onDataChange={triggerRefresh} />
        </section>

        {isLoggedIn && (
          <section className="space-y-6">
            <DocumentList refreshSignal={refresh} />
          </section>
        )}
      </main>
    </div>
  );
}
