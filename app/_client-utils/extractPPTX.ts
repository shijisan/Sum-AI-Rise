"use client";
import JSZip from "jszip";

export async function extractPPTXText(file: File): Promise<string> {
	const zip = await JSZip.loadAsync(file);
	const slideTextChunks: string[] = [];

	for (const filename of Object.keys(zip.files)) {
		if (filename.match(/^ppt\/slides\/slide\d+\.xml$/)) {
			const xmlContent = await zip.files[filename].async("text");

			const matches = Array.from(xmlContent.matchAll(/<a:t>(.*?)<\/a:t>/g));
			const textContent = matches.map(match => match[1]).join(" ");

			if (textContent.trim()) {
				slideTextChunks.push(`--- Slide ---\n${textContent}`);
			}
		}
	}

	const result = slideTextChunks.join("\n\n");
	console.log("Extracted PPTX Text:\n", result);
	return result;
}
