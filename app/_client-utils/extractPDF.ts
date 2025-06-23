"use client";

import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export async function extractTextFromPDF(file: File): Promise<string> {
  if (typeof window === "undefined") {
    console.warn("extractTextFromPDF called on the server!");
    return "";
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const allText: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => {
          if ("str" in item) {
            return item.str;
          }
          return ""; // for TextMarkedContent
        })
        .join(" ");

      allText.push(pageText);
    }

    return allText.join("\n\n");
  } catch (err) {
    console.error("PDF extraction failed:", err);
    return "";
  }
}
