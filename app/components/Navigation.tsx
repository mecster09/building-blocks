'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function Navigation() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  const navItems = [
    { href: '/', label: 'Tasks' },
    { href: '/by-category', label: 'By Category' },
    { href: '/completed', label: 'Completed' },
    { href: '/categories', label: 'Categories' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={`hidden sm:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-6 py-4 transition-all duration-300 ${
          isScrolled ? 'bg-background/80 backdrop-blur-sm shadow-sm' : ''
        }`}
      >
        <Image
          src="/icons/mecster09-512-sq-512.png"
          alt="Portfolio Logo"
          width={40}
          height={40}
        />
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-foreground/70 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>
      </nav>

      {/* Mobile Theme Toggle (Always Visible) */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="sm:hidden fixed top-4 right-4 z-50 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '🌞' : '🌙'}
      </button>

      {/* Mobile Navigation */}
      <nav
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 ${
          isScrolled ? 'translate-y-0' : 'translate-y-full'
        } transition-transform duration-300`}
      >
        <div className="grid grid-cols-4 items-center p-4">
          <div className="flex justify-center">
            <Image
              src="/icons/mecster09-512-sq-512.png"
              alt="Portfolio Logo"
              width={24}
              height={24}
            />
          </div>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 text-sm"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
} 