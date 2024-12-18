'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 p-1">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-md ${
          theme === 'light' ? 'bg-foreground text-background' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-label="Light mode"
      >
        🌞
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-md ${
          theme === 'system' ? 'bg-foreground text-background' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-label="System theme"
      >
        💻
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-md ${
          theme === 'dark' ? 'bg-foreground text-background' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-label="Dark mode"
      >
        🌙
      </button>
    </div>
  );
} 