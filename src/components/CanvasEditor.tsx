"use client";

import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, ImageRun } from "docx";
import { saveAs } from "file-saver";

export default function CanvasEditor({ initialJsonData, initialDesignId, initialDesignName }: { initialJsonData?: string, initialDesignId?: string, initialDesignName?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabric, setFabric] = useState<any>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [designId, setDesignId] = useState<string | undefined>(initialDesignId);
  const [designName, setDesignName] = useState<string | undefined>(initialDesignName);

  // Load Fabric.js dynamically
  useEffect(() => {
    import("fabric").then((mod) => {
      setFabric(mod.fabric || mod);
    });
  }, []);

  // Initialize Canvas
  useEffect(() => {
    if (fabric && canvasRef.current) {
      const fabCanvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: false,
        width: 800,
        height: 600,
        backgroundColor: "#fff",
      });
      setCanvas(fabCanvas);
      setIsCanvasReady(true);

      if (initialJsonData) {
        fabCanvas.loadFromJSON(initialJsonData, () => {
          fabCanvas.renderAll();
        });
      }

      return () => {
        fabCanvas.dispose();
        setIsCanvasReady(false);
      };
    }
  }, [fabric]);

  // Add text
  const addText = () => {
    if (!isCanvasReady) return;
    const text = new fabric.IText("Edit me", {
      left: 100,
      top: 100,
      fontFamily: "Arial",
      fontSize: 20,
      fill: "#000",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  // Add image
  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isCanvasReady) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgObj = new Image();
      imgObj.src = event.target?.result as string;
      imgObj.onload = () => {
        const image = new fabric.Image(imgObj);
        image.scaleToWidth(300);
        canvas.add(image);
        canvas.setActiveObject(image);
        canvas.renderAll();
      };
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Crop image
  const cropSelected = () => {
    if (!isCanvasReady) return;
    const obj = canvas.getActiveObject();
    if (!obj || obj.type !== "image") {
      alert("Select an image first");
      return;
    }

    const img = obj as any;
    const cropWidth = img.width / 2;
    const cropHeight = img.height / 2;

    img.set({
      cropX: img.width / 4,
      cropY: img.height / 4,
      width: cropWidth,
      height: cropHeight,
    });
    img.setCoords();
    canvas.renderAll();
  };

  // Alignment helpers
  const alignLeft = () => {
    const objs = canvas.getActiveObjects();
    if (objs.length <= 1) return;
    const minLeft = Math.min(...objs.map((o) => o.left || 0));
    objs.forEach((o) => {
      o.set({ left: minLeft });
      o.setCoords();
    });
    canvas.renderAll();
  };

  const alignCenter = () => {
    const objs = canvas.getActiveObjects();
    if (objs.length <= 1) return;
    const avgCenter =
      objs.reduce((sum, o) => sum + (o.left || 0) + o.getScaledWidth() / 2, 0) /
      objs.length;
    objs.forEach((o) => {
      o.set({ left: avgCenter - o.getScaledWidth() / 2 });
      o.setCoords();
    });
    canvas.renderAll();
  };

  const alignRight = () => {
    const objs = canvas.getActiveObjects();
    if (objs.length <= 1) return;
    const maxRight = Math.max(
      ...objs.map((o) => (o.left || 0) + o.getScaledWidth())
    );
    objs.forEach((o) => {
      o.set({ left: maxRight - o.getScaledWidth() });
      o.setCoords();
    });
    canvas.renderAll();
  };

  // Drawing mode
  const startSigning = () => {
    canvas.isDrawingMode = true;
    setIsDrawing(true);
  };
  const stopSigning = () => {
    canvas.isDrawingMode = false;
    setIsDrawing(false);
  };

  // Style selected text
  const styleSelected = () => {
    const obj = canvas.getActiveObject();
    if (obj && obj.type === "i-text") {
      obj.set({
        fontFamily: (document.getElementById("fontFamily") as HTMLSelectElement)
          .value,
        fill: (document.getElementById("textColor") as HTMLInputElement).value,
        fontSize: parseInt(
          (document.getElementById("fontSize") as HTMLInputElement).value
        ),
      });
      obj.setCoords();
      canvas.renderAll();
    }
  };

  const toggleBold = () => {
    const obj = canvas.getActiveObject();
    if (obj && obj.type === "i-text") {
      obj.set("fontWeight", obj.fontWeight === "bold" ? "normal" : "bold");
      obj.setCoords();
      canvas.renderAll();
    }
  };

  const toggleItalic = () => {
    const obj = canvas.getActiveObject();
    if (obj && obj.type === "i-text") {
      obj.set("fontStyle", obj.fontStyle === "italic" ? "normal" : "italic");
      obj.setCoords();
      canvas.renderAll();
    }
  };

  const onSave = async () => {
    if (!isCanvasReady || !canvas) return;

    let currentDesignName = designName;
    if (!currentDesignName) {
      currentDesignName = prompt("Enter a name for your design:");
      if (!currentDesignName) {
        alert("Design name cannot be empty.");
        return;
      }
      setDesignName(currentDesignName); // Set the name if it's a new design
    }

    const imageData = canvas.toDataURL({
      format: "png",
      quality: 0.8,
    });
    const jsonData = JSON.stringify(canvas.toJSON());

    try {
      const method = designId ? "PUT" : "POST";
      const url = designId ? `/api/canvas-designs/${designId}` : "/api/canvas-designs";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: currentDesignName,
          imageData,
          jsonData,
        }),
      });

      if (response.ok) {
        const savedDesign = await response.json();
        if (savedDesign.id && !designId) {
          setDesignId(savedDesign.id); // Set ID for newly created design
        }
        alert("Design saved successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to save design: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error saving design:", error);
      alert("An error occurred while saving the design.");
    }
  };

  const onLoad = async () => {
    if (!isCanvasReady || !canvas) return;

    try {
      const response = await fetch("/api/canvas-designs");
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to fetch designs: ${errorData.message || response.statusText}`);
        return;
      }

      const designs = await response.json();
      if (designs.length === 0) {
        alert("No saved designs found.");
        return;
      }

      const designOptions = designs.map((d: any) => `${d.name} (ID: ${d.id})`).join("\n");
      const selectedDesignId = prompt(`Select a design to load (enter ID):\n${designOptions}`);

      if (!selectedDesignId) {
        return; // User cancelled
      }

      // Navigate to the new page to load the design
      window.location.href = `/canvas-designs/${selectedDesignId}`;

    } catch (error) {
      console.error("Error loading design:", error);
      alert("An error occurred while loading the design.");
    }
  };

  // ===== DOWNLOAD FUNCTIONS =====
  const downloadAsImage = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
    });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas.png";
    link.click();
  };

  const downloadAsPDF = () => {
    if (!canvas) return;
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("canvas.pdf");
  };

  const downloadAsDOCX = async () => {
    if (!canvas) return;
    const imgData = canvas.toDataURL("image/png");
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: await fetch(imgData).then((r) => r.blob()),
                  transformation: {
                    width: canvas.width,
                    height: canvas.height,
                  },
                }),
              ],
            }),
          ],
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "canvas.docx");
  };

  const downloadAsHTML = () => {
    if (!canvas) return;
    const svgData = canvas.toSVG();
    const blob = new Blob([svgData], { type: "text/html" });
    saveAs(blob, "canvas.html");
  };

  return (
    <div className="editor-container" style={editorContainerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Canvas Editor</h1>
        <p style={subtitleStyle}>Create and edit your designs with ease</p>
      </header>

      <div className="toolbar" style={toolbarStyle}>
        {/* Objects */}
        <div className="toolbar-section" style={toolbarSectionStyle}>
          <span style={sectionLabelStyle}>Objects</span>
          <button
            onClick={addText}
            disabled={!isCanvasReady}
            style={isCanvasReady ? buttonStyle : disabledButtonStyle}
          >
            <i className="fas fa-font" style={iconStyle}></i> Add Text
          </button>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={addImage}
            style={{ display: "none" }}
          />
          <label
            htmlFor="imageUpload"
            style={isCanvasReady ? buttonStyle : disabledButtonStyle}
          >
            <i className="fas fa-image" style={iconStyle}></i> Add Image
          </label>
          <button onClick={cropSelected} style={buttonStyle}>
            <i className="fas fa-crop" style={iconStyle}></i> Crop
          </button>
          <button onClick={onSave} style={buttonStyle}>
            <i className="fas fa-save" style={iconStyle}></i> Save Design
          </button>
          <button onClick={onLoad} style={buttonStyle}>
            <i className="fas fa-folder-open" style={iconStyle}></i> Load Design
          </button>
        </div>

        {/* Align */}
        <div className="toolbar-section" style={toolbarSectionStyle}>
          <span style={sectionLabelStyle}>Align</span>
          <button onClick={alignLeft} style={buttonStyle}>
            <i className="fas fa-align-left" style={iconStyle}></i>
          </button>
          <button onClick={alignCenter} style={buttonStyle}>
            <i className="fas fa-align-center" style={iconStyle}></i>
          </button>
          <button onClick={alignRight} style={buttonStyle}>
            <i className="fas fa-align-right" style={iconStyle}></i>
          </button>
        </div>

        {/* Draw */}
        <div className="toolbar-section" style={toolbarSectionStyle}>
          <span style={sectionLabelStyle}>Draw</span>
          <button
            onClick={startSigning}
            style={isDrawing ? activeButtonStyle : buttonStyle}
          >
            <i className="fas fa-pen" style={iconStyle}></i> Start
          </button>
          <button onClick={stopSigning} style={buttonStyle}>
            <i className="fas fa-stop" style={iconStyle}></i> Stop
          </button>
        </div>

        {/* Text */}
        <div className="toolbar-section" style={toolbarSectionStyle}>
          <span style={sectionLabelStyle}>Text</span>
          <select
            id="fontFamily"
            onChange={styleSelected}
            style={selectStyle}
            defaultValue="Arial"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
          <input
            type="color"
            id="textColor"
            onChange={styleSelected}
            defaultValue="#000000"
            style={colorInputStyle}
          />
          <input
            type="number"
            id="fontSize"
            defaultValue={20}
            min={8}
            max={72}
            onChange={styleSelected}
            style={fontSizeInputStyle}
          />
          <button onClick={toggleBold} style={buttonStyle}>
            <strong>B</strong>
          </button>
          <button onClick={toggleItalic} style={buttonStyle}>
            <em>I</em>
          </button>
        </div>

        {/* Export */}
        <div className="toolbar-section" style={toolbarSectionStyle}>
          <span style={sectionLabelStyle}>Export</span>
          <button onClick={downloadAsImage} style={buttonStyle}>
            PNG
          </button>
          <button onClick={downloadAsPDF} style={buttonStyle}>
            PDF
          </button>
          <button onClick={downloadAsDOCX} style={buttonStyle}>
            DOCX
          </button>
          <button onClick={downloadAsHTML} style={buttonStyle}>
            HTML
          </button>
        </div>
      </div>

      <div className="canvas-wrapper" style={canvasWrapperStyle}>
        <canvas ref={canvasRef} width={800} height={600} style={canvasStyle} />
      </div>

      {/* Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />
    </div>
  );
}

// === Styles ===
const editorContainerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "2rem",
  fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  backgroundColor: "#f8f9fa",
  minHeight: "100vh",
};
const headerStyle = {
  textAlign: "center",
  marginBottom: "2rem",
  color: "#343a40",
};
const titleStyle = {
  fontSize: "2.5rem",
  fontWeight: "600",
  marginBottom: "0.5rem",
  color: "#212529",
};
const subtitleStyle = { fontSize: "1rem", color: "#6c757d", margin: 0 };
const toolbarStyle = {
  backgroundColor: "#ffffff",
  padding: "1rem",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  marginBottom: "2rem",
  display: "flex",
  flexWrap: "wrap",
  gap: "1.5rem",
  alignItems: "center",
};
const toolbarSectionStyle = {
  display: "flex",
  gap: "0.5rem",
  alignItems: "center",
};
const sectionLabelStyle = {
  fontWeight: "600",
  color: "#495057",
  fontSize: "0.9rem",
  marginRight: "0.5rem",
};
const buttonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#4a6bff",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "0.9rem",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};
const disabledButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#adb5bd",
  cursor: "not-allowed",
};
const activeButtonStyle = { ...buttonStyle, backgroundColor: "#00b894" };
const iconStyle = { fontSize: "0.9rem" };
const selectStyle = {
  padding: "0.5rem",
  borderRadius: "6px",
  border: "1px solid #dee2e6",
  backgroundColor: "#ffffff",
  cursor: "pointer",
  fontSize: "0.9rem",
  minWidth: "120px",
};
const colorInputStyle = {
  width: "40px",
  height: "40px",
  padding: "2px",
  borderRadius: "6px",
  border: "1px solid #dee2e6",
  cursor: "pointer",
  backgroundColor: "#ffffff",
};
const fontSizeInputStyle = {
  padding: "0.5rem",
  borderRadius: "6px",
  border: "1px solid #dee2e6",
  width: "60px",
  fontSize: "0.9rem",
};
const canvasWrapperStyle = {
  backgroundColor: "#ffffff",
  padding: "1rem",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  display: "inline-block",
};
const canvasStyle = {
  border: "1px solid #e9ecef",
  borderRadius: "4px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
};
