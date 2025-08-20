"use client"; // This directive makes it a Client Component

import dynamic from "next/dynamic";

const CanvasEditor = dynamic(() => import("@/components/CanvasEditor"), {
  ssr: false,
  loading: () => <div>Loading Editor...</div>,
});

interface ClientCanvasEditorProps {
  initialJsonData?: string;
}

export default function ClientCanvasEditor({ initialJsonData }: ClientCanvasEditorProps) {
  return <CanvasEditor initialJsonData={initialJsonData} />;
}
