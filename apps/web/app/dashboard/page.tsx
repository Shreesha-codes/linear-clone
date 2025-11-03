'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useIssueStore } from '@/stores/issueStore';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { issues } = useIssueStore();

  // Mock data for stats (replace with real API data)
  const stats = {
    total: Array.from(issues.values()).length || 12,
    inProgress: Array.from(issues.values()).filter((i) => i.status === 'in_progress').length || 5,
    completed: Array.from(issues.values()).filter((i) => i.status === 'done').length || 7,
    overdue: 2,
  };

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      type: 'issue_created',
      user: 'Sarah Chen',
      action: 'created',
      target: 'LIN-234: Add dark mode support',
      time: '5m ago',
      avatar: 'SC',
    },
    {
      id: 2,
      type: 'issue_completed',
      user: 'Alex Kumar',
      action: 'completed',
      target: 'LIN-231: Fix login bug',
      time: '1h ago',
      avatar: 'AK',
    },
    {
      id: 3,
      type: 'comment',
      user: 'Maya Patel',
      action: 'commented on',
      target: 'LIN-229: Update documentation',
      time: '2h ago',
      avatar: 'MP',
    },
    {
      id: 4,
      type: 'issue_assigned',
      user: 'Jordan Lee',
      action: 'assigned you to',
      target: 'LIN-235: Performance optimization',
      time: '3h ago',
      avatar: 'JL',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'issue_created':
        return <Plus className="h-4 w-4 text-blue-500" />;
      case 'issue_completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'comment':
        return <AlertCircle className="h-4 w-4 text-purple-500" />;
      case 'issue_assigned':
        return <Users className="h-4 w-4 text-orange-500" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-muted-foreground text-lg">
          Here's what's happening with your projects today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Issues */}
        <div className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <Badge variant="secondary" className="text-xs">
              All time
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Issues</p>
          </div>
        </div>

        {/* In Progress */}
        <div className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
            <Badge variant="inProgress" className="text-xs">
              Active
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">{stats.inProgress}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
        </div>

        {/* Completed */}
        <div className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <Badge variant="done" className="text-xs">
              Done
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">{stats.completed}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </div>

        {/* Overdue */}
        <div className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <Badge variant="error" className="text-xs">
              Urgent
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">{stats.overdue}</p>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link href="/issues/me">
              <Button className="w-full justify-start h-auto py-4 group" variant="outline">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">New Issue</p>
                    <p className="text-xs text-muted-foreground">Create a new task</p>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Button>
            </Link>

            <Link href="/issues/me">
              <Button className="w-full justify-start h-auto py-4 group" variant="outline">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <Search className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">Search Issues</p>
                    <p className="text-xs text-muted-foreground">Find anything quickly</p>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Button>
            </Link>

            <Link href="/issues/me">
              <Button className="w-full justify-start h-auto py-4 group" variant="outline">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">My Teams</p>
                    <p className="text-xs text-muted-foreground">View team activity</p>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </h2>
            <Link
              href="/issues/me"
              className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="p-4 hover:bg-muted/50 transition-colors group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {activity.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start gap-2">
                      <div className="mt-1">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{' '}
                          <span className="text-muted-foreground">{activity.action}</span>{' '}
                          <span className="font-medium group-hover:text-primary transition-colors">
                            {activity.target}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State for New Users */}
      {stats.total === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Ready to get started?</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Create your first issue or explore teams to begin tracking your work
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-4">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Issue
            </Button>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Browse Teams
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
