"use client";

import dynamic from "next/dynamic";

const CanvasEditor = dynamic(() => import("@/components/CanvasEditor"), {
  ssr: false,
  loading: () => <div>Loading Editor...</div>,
});

export default function GrokEditorPage() {
  return (
    <div style={{ minHeight: "100vh", padding: "20px" }}>
      <CanvasEditor />
    </div>
  );
}
