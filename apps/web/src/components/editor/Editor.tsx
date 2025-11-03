'use client';

import { cn } from '@/lib/utils';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef } from 'react';
import { Markdown } from 'tiptap-markdown';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const Editor = ({
  value,
  onChange,
  className = '',
  placeholder = 'Add description...',
}: EditorProps) => {
  const markdownValue = useRef<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder,
      }),
    ],
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none focus:outline-none min-h-[100px] px-3 py-2',
          className
        ),
      },
    },
    content: value || '',
    onUpdate: ({ editor }) => {
      try {
        const storage = editor.storage as any;
        const markdown = storage.markdown?.getMarkdown?.() || editor.getText();
        markdownValue.current = markdown;
        onChange(markdown || '');
      } catch (_error) {
        // Fallback to plain text if markdown storage fails
        markdownValue.current = editor.getText();
        onChange(editor.getText());
      }
    },
  });

  // Update content when value changes externally
  useEffect(() => {
    if (editor && markdownValue.current !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border rounded-md overflow-hidden bg-background">
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
