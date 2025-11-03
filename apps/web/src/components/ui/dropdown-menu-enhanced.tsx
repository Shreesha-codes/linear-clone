'use client';

import { cn } from '@/lib/utils';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, type ReactNode } from 'react';

interface DropdownMenuProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}

export function DropdownMenu({ trigger, children, align = 'right', className }: DropdownMenuProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={Fragment}>{trigger}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            'absolute z-50 mt-2 w-56 origin-top-right rounded-md bg-background border border-border shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
            {
              'right-0': align === 'right',
              'left-0': align === 'left',
            },
            className
          )}
        >
          <div className="py-1">{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  disabled = false,
  className,
  icon,
}: MenuItemProps) {
  return (
    <Menu.Item disabled={disabled}>
      {({ active }) => (
        <button
          type="button"
          onClick={onClick}
          className={cn(
            'flex w-full items-center px-3 py-2 text-sm transition-colors',
            {
              'bg-accent text-accent-foreground': active && !disabled,
              'text-foreground': !disabled,
              'text-muted-foreground cursor-not-allowed opacity-50': disabled,
            },
            className
          )}
        >
          {icon && <span className="mr-2 flex items-center">{icon}</span>}
          {children}
        </button>
      )}
    </Menu.Item>
  );
}

export function DropdownMenuDivider() {
  return <div className="my-1 h-px bg-border" />;
}

export function DropdownMenuHeader({ children }: { children: ReactNode }) {
  return (
    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      {children}
    </div>
  );
}

// Compound component pattern
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Divider = DropdownMenuDivider;
DropdownMenu.Header = DropdownMenuHeader;
