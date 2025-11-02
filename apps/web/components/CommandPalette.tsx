'use client';

import {
  FileText,
  FolderKanban,
  Inbox,
  ListTodo,
  Plus,
  Repeat,
  Search,
  Settings,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useTeamStore } from '@/stores/teamStore';
import { useUIStore } from '@/stores/uiStore';

interface CommandAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onSelect: () => void;
  category: 'actions' | 'navigation' | 'search';
  shortcut?: string;
}

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, closeCommandPalette, openModal } = useUIStore();
  const activeTeam = useTeamStore((state) => state.getActiveTeam());
  const [search, setSearch] = useState('');

  // Quick actions
  const actions: CommandAction[] = [
    {
      id: 'create-issue',
      label: 'Create new issue',
      icon: <Plus className="h-4 w-4" />,
      onSelect: () => {
        closeCommandPalette();
        openModal('create-issue');
      },
      category: 'actions',
      shortcut: 'C',
    },
    {
      id: 'create-project',
      label: 'Create new project',
      icon: <Plus className="h-4 w-4" />,
      onSelect: () => {
        closeCommandPalette();
        openModal('create-project');
      },
      category: 'actions',
    },
    {
      id: 'create-cycle',
      label: 'Create new cycle',
      icon: <Plus className="h-4 w-4" />,
      onSelect: () => {
        closeCommandPalette();
        openModal('create-cycle');
      },
      category: 'actions',
    },
  ];

  // Navigation items
  const navigationActions: CommandAction[] = [
    {
      id: 'nav-my-issues',
      label: 'Go to My Issues',
      icon: <ListTodo className="h-4 w-4" />,
      onSelect: () => {
        closeCommandPalette();
        router.push('/issues/me');
      },
      category: 'navigation',
      shortcut: 'G → I',
    },
    {
      id: 'nav-inbox',
      label: 'Go to Inbox',
      icon: <Inbox className="h-4 w-4" />,
      onSelect: () => {
        closeCommandPalette();
        router.push('/inbox');
      },
      category: 'navigation',
    },
    {
      id: 'nav-settings',
      label: 'Go to Settings',
      icon: <Settings className="h-4 w-4" />,
      onSelect: () => {
        closeCommandPalette();
        router.push('/settings');
      },
      category: 'navigation',
    },
  ];

  // Add team-specific navigation if team is active
  if (activeTeam?.id) {
    navigationActions.push(
      {
        id: 'nav-team-issues',
        label: 'Go to Issues',
        icon: <FileText className="mr-2 h-4 w-4" />,
        onSelect: () => {
          router.push(`/team/${activeTeam.id}/issues`);
          closeCommandPalette();
        },
        category: 'navigation' as const,
        shortcut: 'g i',
      },
      {
        id: 'nav-team-projects',
        label: 'Go to Projects',
        icon: <FolderKanban className="mr-2 h-4 w-4" />,
        onSelect: () => {
          router.push(`/team/${activeTeam.id}/projects`);
          closeCommandPalette();
        },
        category: 'navigation' as const,
        shortcut: 'g p',
      },
      {
        id: 'nav-team-cycles',
        label: 'Go to Cycles',
        icon: <Repeat className="mr-2 h-4 w-4" />,
        onSelect: () => {
          router.push(`/team/${activeTeam.id}/cycles`);
          closeCommandPalette();
        },
        category: 'navigation' as const,
        shortcut: 'g c',
      }
    );
  } // Search actions
  const searchActions: CommandAction[] = [
    {
      id: 'search-issues',
      label: 'Search issues...',
      icon: <Search className="h-4 w-4" />,
      onSelect: () => {
        // Keep command palette open and focus on search
        // In real implementation, this would switch to issue search mode
        console.log('Searching issues:', search);
      },
      category: 'search',
    },
    {
      id: 'search-projects',
      label: 'Search projects...',
      icon: <Search className="h-4 w-4" />,
      onSelect: () => {
        console.log('Searching projects:', search);
      },
      category: 'search',
    },
  ];

  // Filter actions based on search
  const filterActions = (items: CommandAction[]) => {
    if (!search) return items;
    return items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
  };

  const filteredActions = filterActions(actions);
  const filteredNavigation = filterActions(navigationActions);
  const filteredSearch = filterActions(searchActions);

  // Handle command palette close
  const handleClose = useCallback(() => {
    closeCommandPalette();
    setSearch('');
  }, [closeCommandPalette]);

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={handleClose}>
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Quick Actions */}
        {filteredActions.length > 0 && (
          <>
            <CommandGroup heading="Actions">
              {filteredActions.map((action) => (
                <CommandItem
                  key={action.id}
                  onSelect={action.onSelect}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {action.icon}
                    <span>{action.label}</span>
                  </div>
                  {action.shortcut && (
                    <span className="text-xs text-muted-foreground">{action.shortcut}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Navigation */}
        {filteredNavigation.length > 0 && (
          <>
            <CommandGroup heading="Navigation">
              {filteredNavigation.map((action) => (
                <CommandItem
                  key={action.id}
                  onSelect={action.onSelect}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {action.icon}
                    <span>{action.label}</span>
                  </div>
                  {action.shortcut && (
                    <span className="text-xs text-muted-foreground">{action.shortcut}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Search */}
        {search && filteredSearch.length > 0 && (
          <CommandGroup heading="Search">
            {filteredSearch.map((action) => (
              <CommandItem key={action.id} onSelect={action.onSelect}>
                <div className="flex items-center gap-2">
                  {action.icon}
                  <span>{action.label}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* TODO: Add recent searches, issues, projects from API */}
        {!search && (
          <CommandGroup heading="Recent">
            <CommandItem disabled>
              <span className="text-muted-foreground">No recent items</span>
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
