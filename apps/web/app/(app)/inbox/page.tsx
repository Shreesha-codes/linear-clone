'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Archive,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  MessageSquare,
  MoreHorizontal,
  UserPlus,
} from 'lucide-react';
import { useState } from 'react';

type NotificationType = 'mention' | 'assignment' | 'comment' | 'update';
type FilterType = 'all' | 'unread' | 'mentions';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  user: {
    name: string;
    avatar: string;
  };
  issue?: {
    identifier: string;
    title: string;
  };
}

export default function InboxPage() {
  const [filter, setFilter] = useState<FilterType>('all');

  // Mock notifications
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'mention',
      title: 'Mentioned you in a comment',
      description: '"@you Can you review this change before we deploy?"',
      time: '5m ago',
      read: false,
      user: { name: 'Sarah Chen', avatar: 'SC' },
      issue: { identifier: 'LIN-234', title: 'Add dark mode support' },
    },
    {
      id: '2',
      type: 'assignment',
      title: 'Assigned you to an issue',
      description: 'You have been assigned to work on this issue',
      time: '1h ago',
      read: false,
      user: { name: 'Alex Kumar', avatar: 'AK' },
      issue: { identifier: 'LIN-235', title: 'Performance optimization' },
    },
    {
      id: '3',
      type: 'comment',
      title: 'Commented on an issue',
      description: '"The latest changes look great! Ready to ship."',
      time: '2h ago',
      read: true,
      user: { name: 'Maya Patel', avatar: 'MP' },
      issue: { identifier: 'LIN-231', title: 'Fix login bug' },
    },
    {
      id: '4',
      type: 'update',
      title: 'Updated issue status',
      description: 'Changed status from "In Progress" to "Done"',
      time: '3h ago',
      read: true,
      user: { name: 'Jordan Lee', avatar: 'JL' },
      issue: { identifier: 'LIN-229', title: 'Update documentation' },
    },
  ];

  const filteredNotifications = mockNotifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'mentions') return notif.type === 'mention';
    return true;
  });

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'mention':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'assignment':
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'update':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Inbox
          </h1>
          <p className="text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Check className="h-4 w-4" />
            Mark all read
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Archive className="h-4 w-4" />
            Archive all
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            filter === 'all' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
          }`}
        >
          All
          <Badge variant="secondary" className="ml-2 text-xs">
            {mockNotifications.length}
          </Badge>
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            filter === 'unread' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <Badge variant="primary" className="ml-2 text-xs">
              {unreadCount}
            </Badge>
          )}
        </button>
        <button
          type="button"
          onClick={() => setFilter('mentions')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            filter === 'mentions' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
          }`}
        >
          Mentions
          <Badge variant="secondary" className="ml-2 text-xs">
            {mockNotifications.filter((n) => n.type === 'mention').length}
          </Badge>
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`bg-card border rounded-xl p-5 hover:shadow-md transition-all duration-200 group cursor-pointer animate-in slide-in-from-bottom-2 ${
                !notification.read ? 'border-primary/50 bg-primary/5' : 'border-border'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`p-3 rounded-lg flex-shrink-0 ${
                    !notification.read ? 'bg-primary/10' : 'bg-muted'
                  }`}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-border">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {notification.user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{notification.user.name}</span>
                        <span className="text-sm text-muted-foreground">{notification.title}</span>
                      </div>
                      {notification.issue && (
                        <p className="text-xs text-muted-foreground font-mono">
                          {notification.issue.identifier} · {notification.issue.title}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {notification.time}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground italic">{notification.description}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.read && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Mark as read
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                      <Archive className="h-3 w-3" />
                      Archive
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Unread Indicator */}
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-card border border-border rounded-xl p-16 text-center space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Bell className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">All caught up!</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {filter === 'unread'
                ? "You've read all your notifications. Great job staying on top of things!"
                : "No notifications to show. We'll let you know when something needs your attention."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
