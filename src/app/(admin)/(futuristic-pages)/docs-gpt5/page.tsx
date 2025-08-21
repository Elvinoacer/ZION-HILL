"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
});

const DocsGpt5Page = () => {
  const [content, setContent] = useState("<p>Hello World! 🌎️</p>");

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Tiptap Rich Text Editor
      </h1>
      <RichTextEditor content={content} onChange={(html) => setContent(html)} />
      <div className="mt-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">HTML Output</h2>
        <pre className="whitespace-pre-wrap">{content}</pre>
      </div>
    </div>
  );
};

export default DocsGpt5Page;
