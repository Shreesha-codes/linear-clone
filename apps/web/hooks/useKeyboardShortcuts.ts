'use client';

import { useUIStore } from '@/stores/uiStore';
import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  handler: () => void;
  description: string;
}

interface SequenceShortcut {
  sequence: string[];
  handler: () => void;
  description: string;
}

const shortcuts: KeyboardShortcut[] = [
  {
    key: 'k',
    metaKey: true,
    handler: () => useUIStore.getState().toggleCommandPalette(),
    description: 'Open command palette',
  },
  {
    key: 'k',
    ctrlKey: true,
    handler: () => useUIStore.getState().toggleCommandPalette(),
    description: 'Open command palette',
  },
  {
    key: 'Escape',
    handler: () => {
      const state = useUIStore.getState();
      if (state.commandPaletteOpen) {
        state.closeCommandPalette();
      } else if (state.activeModal) {
        state.closeModal();
      }
    },
    description: 'Close modals',
  },
  {
    key: '/',
    handler: () => {
      // Focus search input when command palette opens
      useUIStore.getState().openCommandPalette();
    },
    description: 'Focus search',
  },
  {
    key: '?',
    shiftKey: true,
    handler: () => {
      useUIStore.getState().openModal('shortcuts-help');
    },
    description: 'Show keyboard shortcuts',
  },
];

// Sequence shortcuts like "G then I" for "Go to Issues"
const sequenceShortcuts: SequenceShortcut[] = [
  {
    sequence: ['g', 'i'],
    handler: () => {
      // Navigate to issues - will be implemented with router
      console.log('Navigate to issues');
    },
    description: 'Go to issues',
  },
  {
    sequence: ['g', 'p'],
    handler: () => {
      console.log('Navigate to projects');
    },
    description: 'Go to projects',
  },
  {
    sequence: ['g', 'c'],
    handler: () => {
      console.log('Navigate to cycles');
    },
    description: 'Go to cycles',
  },
];

export function useKeyboardShortcuts() {
  useEffect(() => {
    let sequenceBuffer: string[] = [];
    let sequenceTimeout: NodeJS.Timeout | null = null;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // Allow Escape and Cmd+K/Ctrl+K even in input fields
        if (event.key === 'Escape' || ((event.metaKey || event.ctrlKey) && event.key === 'k')) {
          // Continue to process these shortcuts
        } else {
          return;
        }
      }

      // Check single key shortcuts
      for (const shortcut of shortcuts) {
        const metaMatch = shortcut.metaKey ? event.metaKey : !event.metaKey;
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;

        if (event.key === shortcut.key && metaMatch && ctrlMatch && shiftMatch && !event.altKey) {
          event.preventDefault();
          shortcut.handler();
          return;
        }
      }

      // Check sequence shortcuts
      if (!event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey) {
        sequenceBuffer.push(event.key.toLowerCase());

        // Clear sequence buffer after 1 second
        if (sequenceTimeout) {
          clearTimeout(sequenceTimeout);
        }
        sequenceTimeout = setTimeout(() => {
          sequenceBuffer = [];
        }, 1000);

        // Check if sequence matches
        for (const shortcut of sequenceShortcuts) {
          if (sequenceBuffer.length === shortcut.sequence.length) {
            const match = shortcut.sequence.every((key, index) => key === sequenceBuffer[index]);
            if (match) {
              event.preventDefault();
              shortcut.handler();
              sequenceBuffer = [];
              if (sequenceTimeout) {
                clearTimeout(sequenceTimeout);
              }
              return;
            }
          }
        }

        // Keep only the last few keys in buffer
        if (sequenceBuffer.length > 3) {
          sequenceBuffer = sequenceBuffer.slice(-3);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout);
      }
    };
  }, []);
}

// Export shortcuts for help dialog
export function getShortcutsList() {
  return {
    single: shortcuts,
    sequence: sequenceShortcuts,
  };
}
