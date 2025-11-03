'use client';

import { DropdownMenu } from '@/components/ui/dropdown-menu-enhanced';
import { Circle, CircleCheck, CircleDot, CircleX, Timer } from 'lucide-react';
import { useState } from 'react';

export type Status = 'backlog' | 'todo' | 'in_progress' | 'done' | 'canceled';

const statusConfig = {
  backlog: { label: 'Backlog', icon: CircleDot, color: 'text-gray-500' },
  todo: { label: 'To Do', icon: Circle, color: 'text-gray-500' },
  in_progress: { label: 'In Progress', icon: Timer, color: 'text-blue-500' },
  done: { label: 'Done', icon: CircleCheck, color: 'text-green-500' },
  canceled: { label: 'Canceled', icon: CircleX, color: 'text-gray-400' },
};

interface StatusMenuProps {
  value?: Status;
  onSelect: (status: Status) => void;
  trigger?: React.ReactNode;
  showSearch?: boolean;
}

export default function StatusMenu({
  value = 'todo',
  onSelect,
  trigger,
  showSearch = false,
}: StatusMenuProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const statuses = Object.entries(statusConfig).filter(([_key, config]) => {
    if (!searchTerm) return true;
    return config.label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentConfig = statusConfig[value];
  const Icon = currentConfig.icon;

  const defaultTrigger = (
    <button
      type="button"
      className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"
    >
      <Icon className={`w-4 h-4 ${currentConfig.color}`} />
      <span>{currentConfig.label}</span>
    </button>
  );

  return (
    <DropdownMenu trigger={trigger || defaultTrigger} className="w-48">
      {showSearch && (
        <div className="px-2 py-2">
          <input
            type="text"
            placeholder="Set status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      {statuses.map(([key, config]) => {
        const StatusIcon = config.icon;
        return (
          <DropdownMenu.Item
            key={key}
            onClick={() => {
              onSelect(key as Status);
              setSearchTerm('');
            }}
            icon={<StatusIcon className={`w-4 h-4 ${config.color}`} />}
          >
            {config.label}
          </DropdownMenu.Item>
        );
      })}
    </DropdownMenu>
  );
}
