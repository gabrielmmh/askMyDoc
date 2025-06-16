'use client';

import Header from '@/components/home/Header';
import UploadForm from '@/components/home/UploadForm';
import headerStyles from '@/styles/home/header.module.css';

export default function HomePage() {
  return (
    <main className={headerStyles.container}>
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-4xl text-center space-y-6">
        <Header />
        <h1 className="text-4xl font-bold text-gray-900 mb-50">AskMyDoc</h1>
        <p className="text-gray-700 text-lg mb-2">
          Faça upload de seu documento e pergunte ao assistente virtual de IA!
        </p>

        <UploadForm />
      </div>
    </main>
  );
}
