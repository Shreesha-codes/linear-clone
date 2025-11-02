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
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { Bell, Menu, Plus, Search } from 'lucide-react';

export function TopNav() {
  const { user } = useAuthStore();
  const { openCommandPalette, toggleSidebar } = useUIStore();

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-4 sticky top-0 z-10">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumb will be added later */}
        <div className="text-sm text-muted-foreground">{/* Breadcrumb navigation */}</div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <Button variant="ghost" size="icon" onClick={openCommandPalette}>
          <Search className="h-5 w-5" />
        </Button>

        {/* Create Issue */}
        <Button variant="default" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Issue
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {user?.name && <p className="font-medium">{user.name}</p>}
                {user?.email && (
                  <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
