"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import { Document, Paragraph, Packer } from "docx";
import {
  PlusCircle,
  Heading1,
  Heading2,
  Type,
  FileText,
  FileOutput,
  FileInput,
  FileDigit,
  Palette,
  TextCursorInput,
  Italic,
  Underline,
  Move3D,
  X,
} from "lucide-react";

export default function DocumentBuilder() {
  const [elements, setElements] = useState([]);
  const [activeTab, setActiveTab] = useState("preview");

  const addElement = (type) => {
    setElements([
      ...elements,
      {
        id: Date.now(),
        type,
        content:
          type === "heading"
            ? "New Heading"
            : "Start typing your paragraph here...",
        style: {
          color: type === "heading" ? "#1e40af" : "#374151",
          fontSize: type === "heading" ? "32px" : "16px",
          fontStyle: "normal",
          textDecoration: "none",
          fontWeight: type === "heading" ? "bold" : "normal",
        },
        animation: "none",
      },
    ]);
  };

  const updateElement = (id, field, value) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, [field]: value } : el))
    );
  };

  const deleteElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  const renderPreview = () => {
    return elements.map((el) => {
      const Tag = el.type === "heading" ? "h2" : "p";
      const variants = {
        none: {},
        fade: {
          opacity: [0, 1],
          transition: { duration: 1, repeat: Infinity, repeatType: "reverse" },
        },
        bounce: {
          y: [0, -30, 0],
          transition: { duration: 0.5, repeat: Infinity },
        },
        spin: {
          rotate: [0, 360],
          transition: { duration: 2, repeat: Infinity, ease: "linear" },
        },
        pulse: {
          scale: [1, 1.1, 1],
          transition: { duration: 0.8, repeat: Infinity },
        },
        wiggle: {
          rotate: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.5, repeat: Infinity },
        },
      };

      return (
        <motion.div
          key={el.id}
          className="group relative"
          style={{
            ...el.style,
            marginBottom: "24px",
            lineHeight: "1.5",
          }}
          variants={variants}
          initial="none"
          animate={el.animation}
        >
          <Tag
            className="outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              updateElement(el.id, "content", e.target.textContent)
            }
          >
            {el.content}
          </Tag>
          <button
            onClick={() => deleteElement(el.id)}
            className="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </motion.div>
      );
    });
  };

  const exportToHTML = () => {
    const content = elements
      .map((el) => {
        const styleString = Object.entries(el.style)
          .map(
            ([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${v};`
          )
          .join(" ");
        return `<${el.type === "heading" ? "h1" : "p"} style="${styleString}">${
          el.content
        }</${el.type === "heading" ? "h1" : "p"}>`;
      })
      .join("\n");
    const html = `<!DOCTYPE html><html><head><title>Document</title></head><body>${content}</body></html>`;
    download("document.html", html, "text/html");
  };

  const exportToText = () => {
    const text = elements.map((el) => el.content).join("\n\n");
    download("document.txt", text, "text/plain");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    elements.forEach((el) => {
      doc.setFontSize(parseInt(el.style.fontSize) || 16);
      doc.setTextColor(el.style.color || "#000000");
      if (el.style.fontStyle === "italic") doc.setFont("helvetica", "italic");
      else doc.setFont("helvetica", "normal");
      if (el.style.fontWeight === "bold") doc.setFont(undefined, "bold");
      doc.text(el.content, 15, y);
      y += parseInt(el.style.fontSize) / 2 + 10;
    });
    doc.save("document.pdf");
  };

  const exportToDOCX = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: elements.map(
            (el) =>
              new Paragraph({
                text: el.content,
                heading: el.type === "heading" ? "Heading1" : undefined,
                styling: {
                  run: {
                    size: parseInt(el.style.fontSize) * 2 || 32,
                    color: el.style.color.replace("#", "") || "000000",
                    italics: el.style.fontStyle === "italic",
                    bold: el.style.fontWeight === "bold",
                    underline:
                      el.style.textDecoration === "underline" ? {} : undefined,
                  },
                },
              })
          ),
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    download(
      "document.docx",
      blob,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
  };

  const download = (filename, content, mime) => {
    const blob =
      content instanceof Blob ? content : new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dynamic Document Builder
          </h1>
          <p className="text-gray-600 mt-2">
            Create beautiful documents with animations and export to multiple
            formats
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Add elements */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PlusCircle className="text-blue-600" size={18} />
              Add Elements
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => addElement("heading")}
                className="w-full flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
              >
                <Heading1 size={16} />
                Add Heading
              </button>
              <button
                onClick={() => addElement("paragraph")}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
              >
                <Type size={16} />
                Add Paragraph
              </button>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm p-1 border border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "preview"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Live Preview
                </button>
                <button
                  onClick={() => setActiveTab("edit")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "edit"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Edit Elements
                </button>
              </div>
            </div>

            {/* Preview/Edit content */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 min-h-[500px]">
              {activeTab === "preview" ? (
                <>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="text-gray-500" size={18} />
                    Document Preview
                  </h2>
                  <div className="prose max-w-none">
                    {elements.length > 0 ? (
                      renderPreview()
                    ) : (
                      <div className="text-center py-16 text-gray-400">
                        <p>Add elements to start building your document</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TextCursorInput className="text-gray-500" size={18} />
                    Edit Elements
                  </h2>
                  {elements.length > 0 ? (
                    <div className="space-y-4">
                      {elements.map((el) => (
                        <div
                          key={el.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium">
                              {el.type === "heading" ? "Heading" : "Paragraph"}
                            </h3>
                            <button
                              onClick={() => deleteElement(el.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Palette size={14} className="inline mr-1" />
                                Color
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={el.style.color}
                                  onChange={(e) =>
                                    updateElement(el.id, "style", {
                                      ...el.style,
                                      color: e.target.value,
                                    })
                                  }
                                  className="w-8 h-8"
                                />
                                <span className="text-sm">
                                  {el.style.color}
                                </span>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Font Size
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="range"
                                  min="12"
                                  max="72"
                                  value={parseInt(el.style.fontSize)}
                                  onChange={(e) =>
                                    updateElement(el.id, "style", {
                                      ...el.style,
                                      fontSize: `${e.target.value}px`,
                                    })
                                  }
                                  className="w-full"
                                />
                                <span className="text-sm w-10 text-right">
                                  {parseInt(el.style.fontSize)}px
                                </span>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Italic size={14} className="inline mr-1" />
                                Font Style
                              </label>
                              <select
                                value={el.style.fontStyle}
                                onChange={(e) =>
                                  updateElement(el.id, "style", {
                                    ...el.style,
                                    fontStyle: e.target.value,
                                  })
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                              >
                                <option value="normal">Normal</option>
                                <option value="italic">Italic</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Underline size={14} className="inline mr-1" />
                                Decoration
                              </label>
                              <select
                                value={el.style.textDecoration}
                                onChange={(e) =>
                                  updateElement(el.id, "style", {
                                    ...el.style,
                                    textDecoration: e.target.value,
                                  })
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                              >
                                <option value="none">None</option>
                                <option value="underline">Underline</option>
                              </select>
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Move3D size={14} className="inline mr-1" />
                                Animation
                              </label>
                              <select
                                value={el.animation}
                                onChange={(e) =>
                                  updateElement(
                                    el.id,
                                    "animation",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                              >
                                <option value="none">None</option>
                                <option value="fade">Fade</option>
                                <option value="bounce">Bounce</option>
                                <option value="spin">Spin</option>
                                <option value="pulse">Pulse</option>
                                <option value="wiggle">Wiggle</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-400">
                      <p>No elements to edit. Add some first.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right sidebar - Export options */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileOutput className="text-green-600" size={18} />
              Export Options
            </h2>
            <div className="space-y-3">
              <button
                onClick={exportToHTML}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
              >
                <FileDigit size={16} />
                Export to HTML
              </button>
              <button
                onClick={exportToText}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
              >
                <FileText size={16} />
                Export to Text
              </button>
              <button
                onClick={exportToPDF}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
              >
                <FileInput size={16} />
                Export to PDF
              </button>
              <button
                onClick={exportToDOCX}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
              >
                <FileOutput size={16} />
                Export to Word
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
