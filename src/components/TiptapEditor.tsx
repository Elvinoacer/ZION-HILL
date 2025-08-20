import dynamic from 'next/dynamic';

const TiptapEditor = dynamic(() => import('./TiptapEditorClient'), { ssr: false });

export default TiptapEditor;
