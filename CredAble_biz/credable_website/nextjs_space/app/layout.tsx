import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/navbar';
import ChatWidget from '@/components/chat-widget';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CredAble - AI Operating System for Supply Chain Finance',
  description: 'Transform your working capital and supply chain finance with intelligent AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <ChatWidget />
      </body>
    </html>
  );
}
