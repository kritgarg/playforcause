'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const links = [
    { name: 'Charities', href: '/charities' },
    { name: 'Scores', href: '/scores' },
    { name: 'Membership', href: '/membership' },
  ];

  return (
    <nav className="fixed top-4 left-6 right-6 z-50 bg-white border-4 border-black h-16 flex items-center justify-between px-6 max-w-6xl mx-auto w-full rounded-2xl shadow-[6px_6px_0px_rgba(45,42,38,1)]">
      <div className="flex items-center gap-8">
        <Link href="/" className="font-black text-xl tracking-tight text-[#2d2a26] flex items-center gap-2">
           PlayForCause
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link 
              key={l.href} 
              href={l.href}
              className={`text-sm font-bold transition-transform hover:-translate-y-0.5 ${pathname === l.href ? 'text-[#FFB703] drop-shadow-sm' : 'text-[#2d2a26]'}`}
            >
              {l.name}
            </Link>
          ))}
          {user && (
            <Link href="/dashboard" className={`text-sm font-bold transition-transform hover:-translate-y-0.5 ${pathname === '/dashboard' ? 'text-[#FFB703] drop-shadow-sm' : 'text-[#2d2a26]'}`}>
              Dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {user.role === 'ADMIN' && (
              <Link href="/admin" className="text-sm font-bold text-[#2d2a26] hover:-translate-y-0.5 transition-transform">Admin</Link>
            )}
            <button onClick={logout} className="vercel-btn-secondary !text-xs !py-1 !px-3">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-bold text-[#2d2a26] hover:-translate-y-0.5 transition-transform">Log In</Link>
            <Link href="/signup" className="vercel-btn !text-xs !py-1 !px-3">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
