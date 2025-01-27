'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Calendar, Users, Settings } from 'lucide-react';

const items = [
  {
    title: 'Calendrier',
    href: '/',
    icon: Calendar,
  },
  {
    title: 'Équipes',
    href: '/teams',
    icon: Users,
  },
  {
    title: 'Paramètres',
    href: '/settings',
    icon: Settings,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-6 lg:space-x-8">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href
              ? 'text-primary'
              : 'text-muted-foreground'
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}
