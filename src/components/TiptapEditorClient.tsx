"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Blockquote from '@tiptap/extension-blockquote';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useEffect } from 'react';
import TiptapToolbar from './TiptapToolbar';

const TiptapEditorClient = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Blockquote,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border rounded-md">
      <TiptapToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditorClient;
