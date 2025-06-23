// app/_client-utils/extractPDF.ts

export async function extractTextFromPDF(file: File): Promise<string> {
  if (typeof window === "undefined") {
    console.warn("extractTextFromPDF called on the server!");
    return "";
  }

  try {
    // Use the legacy build which doesn't have canvas dependency issues
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
    
    // Set worker source to CDN
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const allText: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item: any) => item.str).join(" ");
      allText.push(text);
    }

    return allText.join("\n\n");
  } catch (err) {
    console.error("PDF extraction failed:", err);
    return "";
  }
}