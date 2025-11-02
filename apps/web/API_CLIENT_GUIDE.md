# API Client Library - Usage Guide

## Overview

The API client library provides a type-safe, authenticated way to communicate with the Linear Clone backend API. It handles:

- ✅ JWT token authentication
- ✅ Error handling with typed errors
- ✅ Request/response interceptors
- ✅ Type safety with TypeScript
- ✅ Automatic token injection
- ✅ Query parameter handling

## Installation

Already installed! The API client is located in `apps/web/src/lib/api/`

## Setup

### 1. Environment Variables

Create `.env.local` in `apps/web/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws
```

### 2. Import the API

```typescript
import { api } from '@/lib/api';
// or
import { authApi, workspaceApi, issueApi } from '@/lib/api';
```

## Usage Examples

### Authentication

```typescript
'use client';

import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export function LoginForm() {
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });
      
      // Update store with user and token
      login(response.data.user, response.data.token);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof APIError) {
        console.error('Login failed:', error.message);
        // Show error to user
        setError(error.message);
      }
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin(email, password);
    }}>
      {/* form fields */}
    </form>
  );
}
```

### Registration

```typescript
import { api } from '@/lib/api';

const handleRegister = async () => {
  try {
    const response = await api.auth.register({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securePassword123',
    });
    
    console.log('User created:', response.data.user);
    console.log('Token:', response.data.token);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### Fetching Data

```typescript
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await api.workspaces.list();
        setWorkspaces(response.data);
      } catch (error) {
        console.error('Failed to fetch workspaces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {workspaces.map((workspace) => (
        <li key={workspace.id}>{workspace.name}</li>
      ))}
    </ul>
  );
}
```

### Creating Resources

```typescript
import { api } from '@/lib/api';

const createWorkspace = async () => {
  try {
    const response = await api.workspaces.create({
      name: 'My Team',
      slug: 'my-team',
      icon: '🚀',
    });
    
    console.log('Workspace created:', response.data);
  } catch (error) {
    console.error('Failed to create workspace:', error);
  }
};
```

### Updating Resources

```typescript
import { api } from '@/lib/api';

const updateIssue = async (issueId: string) => {
  try {
    const response = await api.issues.update(issueId, {
      status: 'in_progress',
      priority: 'high',
      assigneeId: 'user-123',
    });
    
    console.log('Issue updated:', response.data);
  } catch (error) {
    console.error('Failed to update issue:', error);
  }
};
```

### Filtering Issues

```typescript
import { api } from '@/lib/api';

const fetchFilteredIssues = async (teamId: string) => {
  try {
    const response = await api.issues.list(teamId, {
      status: ['todo', 'in_progress'],
      priority: ['high', 'urgent'],
      assigneeId: 'user-123',
      search: 'bug fix',
    });
    
    console.log('Filtered issues:', response.data);
  } catch (error) {
    console.error('Failed to fetch issues:', error);
  }
};
```

### Error Handling

```typescript
import { api, APIError } from '@/lib/api';

const handleApiCall = async () => {
  try {
    const response = await api.issues.get('issue-id');
    return response.data;
  } catch (error) {
    if (error instanceof APIError) {
      // Typed API error with status code
      switch (error.status) {
        case 401:
          // Unauthorized - redirect to login
          router.push('/login');
          break;
        case 404:
          // Not found
          console.error('Issue not found');
          break;
        case 500:
          // Server error
          console.error('Server error:', error.message);
          break;
        default:
          console.error('API error:', error.message);
      }
    } else {
      // Network or unexpected error
      console.error('Unexpected error:', error);
    }
  }
};
```

### Using with React Query (Optional)

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Fetch workspaces
export function useWorkspaces() {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await api.workspaces.list();
      return response.data;
    },
  });
}

// Create workspace
export function useCreateWorkspace() {
  return useMutation({
    mutationFn: (data: CreateWorkspaceRequest) =>
      api.workspaces.create(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['workspaces']);
    },
  });
}
```

### Integration with Zustand Store

```typescript
// In your component
import { api } from '@/lib/api';
import { useIssueStore } from '@/stores/issueStore';

export function IssueList({ teamId }: { teamId: string }) {
  const { issues, setIssues } = useIssueStore();
  
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await api.issues.list(teamId);
        setIssues(response.data); // Update Zustand store
      } catch (error) {
        console.error('Failed to fetch issues:', error);
      }
    };
    
    fetchIssues();
  }, [teamId, setIssues]);
  
  return (
    <div>
      {issues.map((issue) => (
        <div key={issue.id}>{issue.title}</div>
      ))}
    </div>
  );
}
```

## API Modules

### Available APIs

- **`api.auth`** - Authentication (login, register, logout, me)
- **`api.workspaces`** - Workspace management
- **`api.issues`** - Issue management

### To Add More APIs

Create a new file in `apps/web/src/lib/api/` (e.g., `projects.ts`):

```typescript
import { apiClient, type ApiResponse } from './client';

export interface Project {
  id: string;
  name: string;
  // ...
}

export const projectApi = {
  list: (teamId: string) =>
    apiClient.get<ApiResponse<Project[]>>(`/teams/${teamId}/projects`),
  
  create: (teamId: string, data: CreateProjectRequest) =>
    apiClient.post<ApiResponse<Project>>(`/teams/${teamId}/projects`, data),
  
  // ...
};
```

Then export it in `index.ts`:

```typescript
export * from './projects';
import { projectApi } from './projects';

export const api = {
  // ...existing
  projects: projectApi,
};
```

## TypeScript Types

All API responses and requests are fully typed. Import types as needed:

```typescript
import type { 
  User, 
  LoginRequest, 
  Workspace, 
  Issue,
  IssueStatus,
  IssuePriority 
} from '@/lib/api';
```

## Error Types

```typescript
interface ApiError {
  code: string;      // Error code from backend
  message: string;   // Human-readable message
  details?: unknown; // Additional error details
}

class APIError extends Error {
  code: string;
  status: number;    // HTTP status code
  details?: unknown;
}
```

## Configuration

The API client automatically:
- Adds `Authorization: Bearer <token>` header for authenticated requests
- Includes `Content-Type: application/json` header
- Parses JSON responses
- Handles errors consistently
- Supports query parameters

## Next Steps

1. ✅ API client created
2. ⏳ Create login/register pages using the API
3. ⏳ Integrate with Zustand stores
4. ⏳ Add React Query for caching (optional)
5. ⏳ Add more API modules (projects, cycles, teams, etc.)

## Testing the API

Start both servers:

```bash
# Terminal 1: Backend
cd apps/api
npm run dev

# Terminal 2: Frontend
cd apps/web
npm run dev
```

Then test in your browser console:

```javascript
// Test health endpoint
fetch('http://localhost:3001/health').then(r => r.json()).then(console.log)

// Test login
fetch('http://localhost:3001/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'password' })
}).then(r => r.json()).then(console.log)
```
