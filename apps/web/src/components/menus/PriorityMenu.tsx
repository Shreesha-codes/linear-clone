'use client';

import { DropdownMenu } from '@/components/ui/dropdown-menu-enhanced';
import { AlertCircle, ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { useState } from 'react';

export type Priority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

const priorityConfig = {
  none: { label: 'None', icon: Minus, color: 'text-gray-400' },
  low: { label: 'Low', icon: ArrowDown, color: 'text-blue-500' },
  medium: { label: 'Medium', icon: Minus, color: 'text-yellow-500' },
  high: { label: 'High', icon: ArrowUp, color: 'text-orange-500' },
  urgent: { label: 'Urgent', icon: AlertCircle, color: 'text-red-500' },
};

interface PriorityMenuProps {
  value?: Priority;
  onSelect: (priority: Priority) => void;
  trigger?: React.ReactNode;
  showSearch?: boolean;
}

export default function PriorityMenu({
  value = 'none',
  onSelect,
  trigger,
  showSearch = false,
}: PriorityMenuProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const priorities = Object.entries(priorityConfig).filter(([_key, config]) => {
    if (!searchTerm) return true;
    return config.label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentConfig = priorityConfig[value];
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
            placeholder="Set priority..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      {priorities.map(([key, config]) => {
        const PriorityIcon = config.icon;
        return (
          <DropdownMenu.Item
            key={key}
            onClick={() => {
              onSelect(key as Priority);
              setSearchTerm('');
            }}
            icon={<PriorityIcon className={`w-4 h-4 ${config.color}`} />}
          >
            {config.label}
          </DropdownMenu.Item>
        );
      })}
    </DropdownMenu>
  );
}
