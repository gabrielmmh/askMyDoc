import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AskMyDoc",
  description: "A solution that allows users to upload documents to a webpage, get the extracted text(OCR) and request interactive explanations over the extracted data(LLM).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
