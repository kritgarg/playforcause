'use client';
import { Toaster } from 'sonner';
export default function ToasterProvider() {
  return <Toaster theme="dark" position="bottom-right" closeButton richColors />;
}
