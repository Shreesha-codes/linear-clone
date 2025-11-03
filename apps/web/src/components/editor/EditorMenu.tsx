'use client';

import { cn } from '@/lib/utils';
import type { Editor as TipTapEditor } from '@tiptap/react';
import {
  Bold,
  Code,
  FileCode,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from 'lucide-react';

export interface EditorMenuProps {
  editor: TipTapEditor;
}

const EditorMenu = ({ editor }: EditorMenuProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 flex shadow-md rounded border border-border p-1 gap-0.5">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(
          'px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
          {
            'bg-accent text-foreground': editor.isActive('bold'),
          }
        )}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(
          'px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
          {
            'bg-accent text-foreground': editor.isActive('italic'),
          }
        )}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={cn(
          'px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
          {
            'bg-accent text-foreground': editor.isActive('strike'),
          }
        )}
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={cn(
          'px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
          {
            'bg-accent text-foreground': editor.isActive('code'),
          }
        )}
      >
        <Code className="w-4 h-4" />
      </button>
      <div className="border-r mx-1 border-border" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          'px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
          {
            'bg-accent text-foreground': editor.isActive('bulletList'),
          }
        )}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          'px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
          {
            'bg-accent text-foreground': editor.isActive('orderedList'),
          }
        )}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={cn(
          'px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
          {
            'bg-accent text-foreground': editor.isActive('codeBlock'),
          }
        )}
      >
        <FileCode className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn(
          'px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
          {
            'bg-accent text-foreground': editor.isActive('blockquote'),
          }
        )}
      >
        <Quote className="w-4 h-4" />
      </button>
    </div>
  );
};

export default EditorMenu;
