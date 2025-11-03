'use client';

import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface AvatarProps {
  name?: string;
  avatarUrl?: string;
  online?: boolean;
  showStatus?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

function stringToHslColor(str: string, s: number, l: number) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (words[0].length >= 2) {
    return (words[0][0] + words[0][1]).toUpperCase();
  }
  return words[0][0].toUpperCase();
}

export default function Avatar({
  name,
  avatarUrl,
  online,
  showStatus = false,
  onClick,
  className,
  size = 'sm',
}: AvatarProps) {
  const avatarClasses = cn(
    'flex items-center justify-center rounded-full font-medium',
    sizeClasses[size],
    {
      'cursor-pointer hover:opacity-80 transition-opacity': onClick,
    },
    className
  );

  let avatarContent;

  if (avatarUrl) {
    avatarContent = (
      <img
        src={avatarUrl}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover', sizeClasses[size])}
      />
    );
  } else if (name) {
    avatarContent = (
      <div
        className={cn(avatarClasses, 'text-white')}
        style={{ backgroundColor: stringToHslColor(name, 50, 50) }}
      >
        {getInitials(name)}
      </div>
    );
  } else {
    avatarContent = (
      <div className={cn(avatarClasses, 'bg-muted text-muted-foreground')}>
        <User className="w-1/2 h-1/2" />
      </div>
    );
  }

  return (
    <div className="relative inline-block" onClick={onClick}>
      {avatarContent}
      {showStatus && (
        <span
          className={cn(
            'absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full border-2 border-background',
            {
              'bg-green-500': online,
              'bg-gray-400': !online,
            }
          )}
        />
      )}
    </div>
  );
}
