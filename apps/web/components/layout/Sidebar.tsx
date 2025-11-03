'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTeamStore } from '@/stores/teamStore';
import { useUIStore } from '@/stores/uiStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { ChevronDown, Home, Inbox, Plus, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const activeWorkspace = useWorkspaceStore((state) => state.getActiveWorkspace());
  const teams = useTeamStore((state) => state.teams);
  const activeTeam = useTeamStore((state) => state.getActiveTeam());
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);

  if (sidebarCollapsed) {
    return null;
  }

  const navItems = [
    { href: '/app/my-issues', label: 'My Issues', icon: Home },
    { href: '/app/inbox', label: 'Inbox', icon: Inbox },
    { href: '/app/search', label: 'Search', icon: Search },
  ];

  return (
    <aside className="w-64 border-r bg-card h-screen flex flex-col">
      {/* Workspace Switcher */}
      <div className="p-4 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={activeWorkspace?.icon || undefined} />
                  <AvatarFallback>{activeWorkspace?.name?.[0] || 'W'}</AvatarFallback>
                </Avatar>
                <span className="font-medium truncate">
                  {activeWorkspace?.name || 'Select Workspace'}
                </span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              Create Workspace
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Switch Workspace...</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        {/* Teams Section */}
        <div className="pt-4">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
            Teams
          </div>
          {teams.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">No teams yet</p>
          ) : (
            teams.map((team) => (
              <Link
                key={team.id}
                href={`/app/team/${team.id}`}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  activeTeam?.id === team.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <span className="font-mono text-xs">{team.identifier}</span>
                <span className="truncate">{team.name}</span>
              </Link>
            ))
          )}
        </div>
      </nav>

      {/* Settings Link */}
      <div className="p-2 border-t">
        <Link
          href="/app/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
