'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="space-x-4 flex">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <p
                className={`${
                  pathname === item.href
                    ? 'text-blue-500'
                    : 'text-white-600'
                }`}
              >
                {item.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
