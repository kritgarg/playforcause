import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import ToasterProvider from '@/components/ToasterProvider';

export const metadata = {
  title: 'PlayForCause | Playful Impact',
  description: 'A fun way to support charities by logging your performance.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,600;0,800;0,900;1,800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-primary">
        <AuthProvider>
          <ToasterProvider />
          <Navbar />
          <main className="flex-grow pt-36 pb-16 px-6 max-w-6xl mx-auto w-full">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
