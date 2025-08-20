"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import TiptapImageExtension from "@tiptap/extension-image";
import { Node, mergeAttributes } from "@tiptap/core";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiLink,
  FiImage,
  FiYoutube,
  FiCopy,
  FiEye,
  FiUpload,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiCode,
} from "react-icons/fi";
import { FaQuoteLeft, FaStrikethrough } from "react-icons/fa";

// Custom Image node with captions and alignment
const CaptionedImage = TiptapImageExtension.extend({
  name: "captionedImage",
  addAttributes() {
    return {
      ...this.parent?.(),
      align: { default: "center" },
      caption: { default: "" },
      width: { default: null },
      height: { default: null },
    };
  },
  addCommands() {
    return {
      setCaptionedImage:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const { align, caption, width, ...rest } = HTMLAttributes;
    const figureStyle = width ? `width: ${width}px;` : '';
    return [
      "figure",
      {
        class: `my-4 ${
          align === "left"
            ? "mr-auto ml-0"
            : align === "right"
            ? "ml-auto mr-0"
            : "mx-auto"
        } max-w-full`,
        style: figureStyle, // Apply width style here
        "data-type": "image",
      },
      ["img", mergeAttributes(rest, { class: "rounded-lg shadow-sm" })],
      ["figcaption", { class: "text-sm text-gray-500 mt-2" }, caption || ""],
    ];
  },
});

// Custom Iframe node for video embeds
const Iframe = Node.create({
  name: "iframe",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      width: { default: 640 },
      height: { default: 360 },
      align: { default: "center" },
      caption: { default: "" },
    };
  },
  addCommands() {
    return {
      setIframe:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const { align, caption, ...rest } = HTMLAttributes;
    return [
      "figure",
      {
        class: `my-4 ${
          align === "left"
            ? "mr-auto ml-0"
            : align === "right"
            ? "ml-auto mr-0"
            : "mx-auto"
        } max-w-full`,
        "data-type": "iframe",
      },
      [
        "iframe",
        mergeAttributes(rest, {
          frameborder: "0",
          allowfullscreen: "",
          class: "rounded-lg shadow-sm w-full",
        }),
      ],
      ["figcaption", { class: "text-sm text-gray-500 mt-2" }, caption || ""],
    ];
  },
});

// Image Crop Modal
const ImageCropModal = ({
  src,
  onCrop,
  onClose,
}: {
  src: string;
  onCrop: (url: string) => void;
  onClose: () => void;
}) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Crop Image</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center">
            <img src={src} alt="Preview" className="max-h-full max-w-full" />
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onCrop(src)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const MediaInspector = ({ editor, selectedMediaAttrs, setSelectedMediaAttrs }: {
  editor: any;
  selectedMediaAttrs: {
    type: "image" | "iframe" | null;
    caption?: string;
    width?: number;
    height?: number;
    align?: "left" | "center" | "right";
  } | null;
  setSelectedMediaAttrs: React.Dispatch<React.SetStateAction<{
    type: "image" | "iframe" | null;
    caption?: string;
    width?: number;
    height?: number;
    align?: "left" | "center" | "right";
  } | null>>;
}) => {
  // Initialize with default values, not directly from selectedMediaAttrs
  const [captionInput, setCaptionInput] = useState("");
  const [widthInput, setWidthInput] = useState("");
  const [heightInput, setHeightInput] = useState("");

  useEffect(() => {
    if (selectedMediaAttrs) {
      setCaptionInput(selectedMediaAttrs.caption || "");
      setWidthInput(selectedMediaAttrs.width || "");
      setHeightInput(selectedMediaAttrs.height || "");
    } else {
      // Reset when no media is selected
      setCaptionInput("");
      setWidthInput("");
      setHeightInput("");
    }
  }, [selectedMediaAttrs]);

  // Only render the inspector content if editor and selectedMediaAttrs are present
  if (!editor || !selectedMediaAttrs?.type) {
    return null; // This return is now safe because hooks are called unconditionally above
  }

  const updateAttrs = (attrs: any) => {
    editor
      .chain()
      .focus()
      .updateAttributes(
        selectedMediaAttrs.type === "image" ? "captionedImage" : "iframe",
        attrs
      )
      .run();
    setSelectedMediaAttrs((prev) => ({ ...prev!, ...attrs }));
  };

  const handleBlur = (attrName: string, value: string | number | null) => {
    const currentAttrValue = selectedMediaAttrs[attrName as keyof typeof selectedMediaAttrs];
    const parsedValue = typeof value === 'string' && value !== '' ? parseInt(value) : value;

    if (currentAttrValue !== parsedValue) {
      updateAttrs({ [attrName]: parsedValue });
    }
  };

  const handleCaptionBlur = () => {
    updateAttrs({ caption: captionInput });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 border-t">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Align:</label>
        <div className="flex gap-1">
          {(["left", "center", "right"] as const).map((align) => (
            <button
              type="button"
              key={align}
              onClick={() => updateAttrs({ align })}
              className={`p-2 rounded ${
                selectedMediaAttrs.align === align
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {align === "left" && <FiAlignLeft />}
              {align === "center" && <FiAlignCenter />}
              {align === "right" && <FiAlignRight />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Size:</label>
        <input
          type="number"
          value={widthInput}
          onChange={(e) => setWidthInput(e.target.value)}
          onBlur={(e) => handleBlur('width', e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleBlur('width', e.currentTarget.value); } }}
          className="w-20 border rounded px-2 py-1 text-sm"
          placeholder="Width"
        />
        <span className="text-gray-400">×</span>
        <input
          type="number"
          value={heightInput}
          onChange={(e) => setHeightInput(e.target.value)}
          onBlur={(e) => handleBlur('height', e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleBlur('height', e.currentTarget.value); } }}
          className="w-20 border rounded px-2 py-1 text-sm"
          placeholder="Height"
        />
      </div>

      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          value={captionInput}
          onChange={(e) => setCaptionInput(e.target.value)}
          onBlur={handleCaptionBlur}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCaptionBlur(); } }}
          className="w-full border rounded px-2 py-1 text-sm"
          placeholder="Add caption..."
        />
      </div>
    </div>
  );
};

export function RichTextEditor({
  onChange,
  content = "",
  className = "",
}: {
  onChange?: (html: string) => void;
  content?: string;
  className?: string;
}) {
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [showMediaInputs, setShowMediaInputs] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [selectedMediaAttrs, setSelectedMediaAttrs] = useState<{
    type: "image" | "iframe" | null;
    caption?: string;
    width?: number;
    height?: number;
    align?: "left" | "center" | "right";
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 hover:underline" },
      }),
      Placeholder.configure({
        placeholder: "Write something amazing...",
        emptyEditorClass: "is-editor-empty",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
      CaptionedImage,
      Iframe,
      Youtube.configure({
        controls: true,
        HTMLAttributes: { class: "rounded-lg shadow-sm" },
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none p-4 min-h-[200px]",
      },
      handleClickOn: (view, pos, node) => {
        if (!node) return false;
        const name = node.type.name;
        if (name === "captionedImage") {
          setSelectedMediaAttrs({
            type: "image",
            caption: node.attrs.caption,
            width: node.attrs.width,
            height: node.attrs.height,
            align: node.attrs.align,
          });
        } else if (name === "iframe") {
          setSelectedMediaAttrs({
            type: "iframe",
            caption: node.attrs.caption,
            width: node.attrs.width,
            height: node.attrs.height,
            align: node.attrs.align,
          });
        } else {
          setSelectedMediaAttrs(null);
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
      const text = editor.getText();
      setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
    },
  });

  const resizeImage = async (
    file: File,
    maxWidth: number,
    maxHeight: number
  ) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;

          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpeg", 0.9));
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUploadImage = useCallback(
    async (file?: File) => {
      if (!file || !editor) return;
      try {
        const resized = await resizeImage(file, 1600, 1200);
        editor
          .chain()
          .focus()
          .setCaptionedImage({
            src: resized,
            alt: file.name,
            align: "center",
          })
          .run();
      } catch (err) {
        console.error("Failed to process image", err);
      }
    },
    [editor]
  );

  const handleInsertImageUrl = useCallback(() => {
    if (!editor || !imageUrlInput) return;
    editor
      .chain()
      .focus()
      .setCaptionedImage({
        src: imageUrlInput,
        align: "center",
      })
      .run();
    setImageUrlInput("");
    setShowMediaInputs(false);
  }, [editor, imageUrlInput]);

  const handleInsertVideo = useCallback(() => {
    if (!editor || !videoUrlInput) return;

    const ytMatch = videoUrlInput.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i
    );

    if (ytMatch) {
      editor
        .chain()
        .focus()
        .setIframe({
          src: `https://www.youtube.com/embed/${ytMatch[1]}`,
          width: 640,
          height: 360,
          align: "center",
        })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .setIframe({
          src: videoUrlInput,
          width: 640,
          height: 360,
          align: "center",
        })
        .run();
    }

    setVideoUrlInput("");
    setShowMediaInputs(false);
  }, [editor, videoUrlInput]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  

  return (
    <div
      className={`w-full border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden ${className}`}
    >
      <style jsx global>{`
        .prose {
          max-width: 100%;
        }
        .prose ul,
        .prose ol {
          list-style-position: outside;
          padding-left: 1.5em;
        }
        .prose ul {
          list-style-type: disc;
        }
        .prose ol {
          list-style-type: decimal;
        }
        .prose blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1.5em;
          font-style: italic;
          color: #4b5563;
        }
        .prose pre {
          background: #0f172a;
          color: #f8fafc;
          padding: 1em;
          border-radius: 0.5em;
          overflow-x: auto;
        }
        .prose code {
          background: #e2e8f0;
          padding: 0.2em 0.4em;
          border-radius: 0.3em;
          font-size: 0.9em;
        }
        .prose pre code {
          background: transparent;
          padding: 0;
          border-radius: 0;
        }
        .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>

      {cropModalOpen && (
        <ImageCropModal
          src={cropImageSrc}
          onCrop={(url) => {
            if (editor && selectedMediaAttrs?.type === "image") {
              editor
                .chain()
                .focus()
                .updateAttributes("captionedImage", { src: url })
                .run();
            }
            setCropModalOpen(false);
          }}
          onClose={() => setCropModalOpen(false)}
        />
      )}

      {!editor ? (
        <div className="w-full border rounded-lg shadow-sm bg-white p-8 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading editor...</div>
        </div>
      ) : (
        <>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 rounded-t-xl">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-lg shadow-xs border border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("bold")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700"
            }`}
            aria-label="Bold"
          >
            <FiBold size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("italic")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700"
            }`}
            aria-label="Italic"
          >
            <FiItalic size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("underline")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700"
            }`}
            aria-label="Underline"
          >
            <FiUnderline size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("strike")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700"
            }`}
            aria-label="Strikethrough"
          >
            <FaStrikethrough size={16} />
          </button>
        </div>

        {/* Headings & Paragraph */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-lg shadow-xs border border-gray-200">
          <select
            value={editor.getAttributes("heading")?.level || "paragraph"}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "paragraph") {
                editor.chain().focus().setParagraph().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: parseInt(value) })
                  .run();
              }
            }}
            className="bg-transparent text-gray-700 text-sm border-none focus:ring-0"
          >
            <option value="paragraph">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
          </select>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-lg shadow-xs border border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("bulletList")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700"
            }`}
            aria-label="Bullet List"
          >
            <FiList size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("orderedList")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700"
            }`}
            aria-label="Numbered List"
          >
            <FiList size={18} className="font-bold" />
          </button>
        </div>

        {/* Block Elements */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-lg shadow-xs border border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("blockquote")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700"
            }`}
            aria-label="Blockquote"
          >
            <FaQuoteLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("codeBlock")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700"
            }`}
            aria-label="Code Block"
          >
            <FiCode size={18} />
          </button>
          <button
            type="button"
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("link")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700"
            }`}
            aria-label="Link"
          >
            <FiLink size={18} />
          </button>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-lg shadow-xs border border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: "left" })
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700"
            }`}
            aria-label="Align Left"
          >
            <FiAlignLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: "center" })
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700"
            }`}
            aria-label="Align Center"
          >
            <FiAlignCenter size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: "right" })
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700"
            }`}
            aria-label="Align Right"
          >
            <FiAlignRight size={18} />
          </button>
        </div>

        {/* Media Buttons */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-lg shadow-xs border border-gray-200">
          <button
            type="button"
            onClick={() => setShowMediaInputs(!showMediaInputs)}
            className={`p-2 rounded hover:bg-gray-100 flex items-center gap-1 ${
              showMediaInputs ? "bg-blue-50 text-blue-600" : "text-gray-700"
            }`}
            aria-label="Media"
          >
            <FiImage size={18} />
            <span className="text-sm hidden sm:inline">Media</span>
            {showMediaInputs ? (
              <FiChevronUp size={16} />
            ) : (
              <FiChevronDown size={16} />
            )}
          </button>
        </div>

        {/* Utility Buttons */}
        <div className="flex items-center gap-1 ml-auto p-1 bg-white rounded-lg shadow-xs border border-gray-200">
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(editor.getHTML())}
            className="p-2 rounded hover:bg-gray-100 text-gray-700 flex items-center gap-1"
            aria-label="Copy HTML"
          >
            <FiCopy size={16} />
            <span className="text-sm hidden sm:inline">Copy</span>
          </button>
          <button
            type="button"
            onClick={() => alert(editor.getHTML())}
            className="p-2 rounded hover:bg-gray-100 text-gray-700 flex items-center gap-1"
            aria-label="Show HTML"
          >
            <FiEye size={16} />
            <span className="text-sm hidden sm:inline">HTML</span>
          </button>
        </div>
      </div>

      {/* Media Inputs Section */}
      <AnimatePresence>
        {showMediaInputs && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row gap-3 p-3 border-b bg-gray-50">
              <div className="flex-1">
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    className="hidden"
                    onChange={(e) => handleUploadImage(e.target.files?.[0])}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm"
                  >
                    <FiUpload size={16} />
                    Upload Image
                  </button>
                  <input
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Paste image URL..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleInsertImageUrl}
                    disabled={!imageUrlInput}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Insert
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex gap-2">
                  <input
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    placeholder="Paste YouTube or video URL..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleInsertVideo}
                    disabled={!videoUrlInput}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Embed
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Media Inspector */}
      <MediaInspector editor={editor} selectedMediaAttrs={selectedMediaAttrs} setSelectedMediaAttrs={setSelectedMediaAttrs} />

      {/* Editor Content */}
      <div className="p-1">
        <EditorContent editor={editor} />
      </div>

      {/* Status Bar */}
      <div className="p-3 border-t flex items-center justify-between bg-gray-50 rounded-b-xl">
        <div className="text-sm text-gray-500">{wordCount} words</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900 disabled:opacity-30"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900 disabled:opacity-30"
          >
            Redo
          </button>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
