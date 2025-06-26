"use client"

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs';
import Tesseract from "tesseract.js";

export async function extractPDFText(file: File): Promise<string> {
	const reader = new FileReader();

	return new Promise((resolve) => {
		reader.onload = async () => {
			const typedArray = new Uint8Array(reader.result as ArrayBuffer);
			const pdf = await pdfjs.getDocument({ data: typedArray }).promise;

			let result = "";

			for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
				const page = await pdf.getPage(pageNum);
				const viewport = page.getViewport({ scale: 2 });

				const canvas = document.createElement("canvas");
				const context = canvas.getContext("2d")!;
				canvas.width = viewport.width;
				canvas.height = viewport.height;

				await page.render({ canvasContext: context, viewport }).promise;
				const imageDataUrl = canvas.toDataURL();

				const { data: { text } } = await Tesseract.recognize(imageDataUrl, "eng");
				result += `\n\n--- Page ${pageNum} ---\n\n${text}`;
			}

			resolve(result);
		};

		reader.readAsArrayBuffer(file);
	});
}
