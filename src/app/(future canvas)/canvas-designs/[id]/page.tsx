import { notFound } from "next/navigation";
import ClientCanvasEditor from "@/components/ClientCanvasEditor"; // Import the new Client Component

interface CanvasDesignPageProps {
  params: { id: string };
}

export default async function CanvasDesignPage({ params }: CanvasDesignPageProps) {
  const { id } = params;
  console.log(`Attempting to fetch design with ID: ${id}`);

  let initialJsonData: string | null = null;
  let designData: { name: string; jsonData: string; id: string } | null = null; // Declare designData here

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/canvas-designs/${id}`;
    console.log(`Fetching from URL: ${apiUrl}`);
    const response = await fetch(apiUrl, {
      cache: 'no-store' // Ensure fresh data
    });

    console.log(`Fetch response status: ${response.status}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.error(`Design with ID ${id} not found.`);
        notFound();
      }
      throw new Error(`Failed to fetch design: ${response.statusText}`);
    }

    designData = await response.json(); // Assign to designData
    console.log("Fetched design data:", designData);
    initialJsonData = designData.jsonData;

  } catch (error) {
    console.error("Error fetching design for ID", id, ":", error);
    notFound();
  }

  return (
    <div style={{ minHeight: "100vh", padding: "20px" }}>
      {initialJsonData && designData ? (
        <ClientCanvasEditor initialJsonData={initialJsonData} initialDesignId={id} initialDesignName={designData.name} />
      ) : (
        <div>Design not found or could not be loaded.</div>
      )}
    </div>
  );
}