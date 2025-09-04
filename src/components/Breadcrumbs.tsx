import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({
  items,
  className = '',
}: BreadcrumbsProps) {
  return (
    <nav
      className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
      aria-label='Breadcrumb'
    >
      <Link
        href='/'
        className='flex items-center gap-1 hover:text-primary transition-colors'
        aria-label='Home'
      >
        <Home className='w-4 h-4' />
        <span>Home</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className='flex items-center space-x-2'>
          <ChevronRight className='w-4 h-4 text-gray-400' />
          {item.href ? (
            <Link
              href={item.href}
              className='hover:text-primary transition-colors'
            >
              {item.label}
            </Link>
          ) : (
            <span className='text-gray-900 font-medium'>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
