"use client"

import { useState } from "react"
import { FaChevronRight, FaRegCopy, FaSync, FaUpload } from "react-icons/fa"
import { SiHuggingface } from "react-icons/si";
import Image from "next/image";
import Link from "next/link";
import Tesseract from "tesseract.js";


import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs';



export default function Landing() {

	const [text, setText] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [copied, setCopied] = useState(false);
	const [process, setProcess] = useState("Processing document");

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setLoading(true);
		console.log("Uploaded file", file);

		if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
			const reader = new FileReader();
			reader.onload = async () => {
				const typedArray = new Uint8Array(reader.result as ArrayBuffer);
				const pdf = await pdfjs.getDocument({ data: typedArray }).promise;

				let fullText = "";

				for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
					const page = await pdf.getPage(pageNum);
					const viewport = page.getViewport({ scale: 2 });

					const canvas = document.createElement("canvas");
					const context = canvas.getContext("2d")!;
					canvas.width = viewport.width;
					canvas.height = viewport.height;

					await page.render({ canvasContext: context, viewport }).promise;

					const imageDataUrl = canvas.toDataURL();

					console.log(`🔍 OCR on page ${pageNum}...`);
					const {
						data: { text: extractedText },
					} = await Tesseract.recognize(imageDataUrl, "eng", {
						logger: (m) => setProcess(`Page ${pageNum}: ${m.status}: ${Math.round(m.progress * 100)}%`),
					});

					fullText += `\n\n--- Page ${pageNum} ---\n\n${extractedText}`;
				}

				console.log("Extracted Text from All Pages:", fullText);

				try {
					setProcess("Summarizing")
					const res = await fetch("https://shijisan-text-summarization.hf.space/summarize", {
						method: "POST",
						headers: {
							"Content-type": "application/json",
						},
						body: JSON.stringify({
							text: fullText,
						}),
					});
					const data = await res.text();
					setText(data);
				} catch (err) {
					console.error("Failed to summarize text", err);
				} finally {
					setLoading(false);
				}
			};
			reader.readAsArrayBuffer(file);
		} else {
			alert("Please upload a PDF file.");
		}
	};


	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy", err);
		}
	}


	return (
		<>
			<main className={`${loading && "hover:cursor-progress"}`}>
				<header className="flex items-center justify-center w-full flex-col space-y-8 pt-[15vh] pb-[5vh] md:px-0 px-8">

					<form className="max-w-6xl w-full flex flex-col justify-center items-center space-y-8">

						<div className="flex flex-col space-y-4 items-center justify-center">
							<h1 className="font-clash md:text-8xl text-4xl font-medium text-center">Sum-AI-Rise: <span className="font-normal">Lesson Learned Easily</span></h1>

							<h2 className="max-w-xl text-center md:text-base text-sm/relaxed">
								Upload PDF, DOCX, or PPTX files to generate smart summaries. The AI adapts based on content length for short notes or detailed documents.
							</h2>
						</div>

						<div className="relative w-fit">
							<button className={`btn font-semibold py-3 ${loading ? "bg-amber-100 hover:cursor-not-allowed" : "bg-amber-400"}`}>
								{loading ?
									<>
										{process} <FaSync className="animate-spin" />
									</>
									:
									<>
										Upload document <FaUpload />
									</>
								}
							</button>
							<input disabled={loading} type="file" accept=".pdf, .docx, .pptx" onChange={handleUpload} className={`opacity-0 absolute w-full h-full top-0 btn ${loading && "hover:cursor-not-allowed"}`} />
						</div>

					</form>



					<div className="flex md:flex-row flex-col md:px-[10vw] gap-8 mt-8 max-h-64 size-full">

						<div className="flex flex-col  space-y-8 grow md:w-1/3 w-full md:order-1 order-2">
							<Link href="/" className="bg-black rounded-2xl w-full flex items-center justify-center text-white text-3xl font-clash font-semibold hover:cursor-pointer hover:text-amber-400 transition-colors md:h-1/2 h-32">Open Source <FaChevronRight className="inline-flex -mt-1 ms-2" />
							</Link>
							<Link href="" className="bg-white hover:bg-amber-50 transition-colors rounded-2xl w-full flex flex-col justify-center text-black text-3xl font-clash font-semibold hover:cursor-pointer p-8 h-1/2">
								<span>Powered by <span className="text-amber-400">AI</span></span>
								<span className="self-end">via <span className="text-amber-400">Hugging Face <SiHuggingface className="inline-flex -mt-1" /></span></span>
							</Link>
						</div>

						<div className="w-full max-w-2xl relative grow md:order-2 order-1">
							<button className="absolute top-4 right-4 btn p-0 hover:text-amber-400 shadow-none" onClick={handleCopy} >{copied ? <>Text copied!</> : <FaRegCopy />}</button>
							<article
								className="min-h-64 h-full bg-white rounded-2xl w-full px-8 pb-8 pt-12  overflow-y-scroll"
								dangerouslySetInnerHTML={{ __html: text || "Summarization goes here..." }}
							/>

						</div>


						<div className="flex flex-col bg-amber-50 rounded-2xl md:w-1/3 w-full grow justify-center items-center p-8 order-3">
							<h6 className="text-3xl font-clash font-medium">&ldquo;Looks good to me! <br /> I think it&apos;s cool!<span className="text-base"><br />- The dev of this tool</span><span><br /><Image className="rounded-full size-10 mt-4 border border-black" src="https://avatars.githubusercontent.com/u/115002067?v=4" width={100} height={100} alt="The developer of this tool's profile picture." /></span></h6>
						</div>

					</div>

				</header>

				<section className="min-h-screen bg-black">

				</section>

			</main>
		</>
	)
}