"use client"

import { useState } from "react"
import { FaChevronRight, FaRegCopy, FaSync, FaUpload } from "react-icons/fa"
import { SiHuggingface } from "react-icons/si";
import Image from "next/image";
import Link from "next/link";
import { extractDocxText } from "./_client-utils/extractDOCX";
import { extractPDFText } from "./_client-utils/extractPDF";
import { extractPPTXText } from "./_client-utils/extractPPTX";
import { AiFillProduct } from "react-icons/ai";


export default function Landing() {

	const [text, setText] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [copied, setCopied] = useState(false);
	const [process, setProcess] = useState("Processing document");
	let fullText = "";

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setLoading(true);
		setProcess("Uploading document...");
		console.log("📄 Uploaded file:", file);

		try {
			if (file.name.endsWith(".pdf")) {
				fullText = await extractPDFText(file);
			} else if (file.name.endsWith(".docx")) {
				fullText = await extractDocxText(file);
			} else if (file.name.endsWith(".pptx")) {
				fullText = await extractPPTXText(file);
			} else {
				alert("Please upload a PDF, DOCX, or PPTX file.");
				return;
			}

			if (fullText === "") {
				setText("Failed to scan the file")
				return;
			}

			setProcess("Summarizing...");
			const res = await fetch("https://shijisan-text-summarization.hf.space/summarize", {
				method: "POST",
				headers: { "Content-type": "application/json" },
				body: JSON.stringify({ text: fullText }),
			});

			const summary = await res.text();
			setText(summary);
		} catch (err) {
			console.error("🚨 Error during file processing:", err);
		} finally {
			setLoading(false);
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



					<div className="flex md:flex-row flex-col md:px-[10vw] gap-8 mt-8 md:max-h-64 size-full">

						<div className="flex flex-col  space-y-8 grow md:w-1/3 w-full md:order-1 order-2">
							<Link href="https://github.com/shijisan/Sum-AI-Rise" className="bg-black rounded-2xl w-full flex items-center justify-center text-white text-3xl font-clash font-semibold hover:cursor-pointer hover:text-amber-400 transition-colors md:h-1/2 h-32">Open Source <FaChevronRight className="inline-flex -mt-1 ms-2" />
							</Link>
							<Link href="https://huggingface.co/spaces/shijisan/text-summarization" className="bg-white hover:bg-amber-50 transition-colors rounded-2xl w-full flex flex-col justify-center text-black text-3xl font-clash font-semibold hover:cursor-pointer p-8 h-1/2">
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

				<section className="md:h-screen h-full bg-black text-white flex items-center">
					<div className="h-fit w-full md:max-w-[1440px] mx-auto flex md:flex-row flex-col items-start md:p-0 p-8 md:gap-0 gap-8">
						<div className="md:w-1/3 w-full">
							<h1 className="text-4xl font-clash md:text-start text-center">How each <br className="md:inline hidden" /> process works?</h1>
						</div>
						<ul className="md:w-2/3 w-full grid md:grid-cols-2 grid-cols-1 justify-center gap-16">
							<li className="space-y-2">
								<div className="flex md:flex-col flex-row items-center md:gap-0 gap-4">
									<AiFillProduct className="text-5xl text-amber-400 rotate-[270deg]" />
									<h3 className="font-clash font-medium text-xl">PDF</h3>
								</div>
								<h6 className="text-sm text-background">The PDF files uploaded get converted to an image using <span className="text-amber-100">`react-pdf`</span> and is read by Optical Character Recognition via <span className="text-amber-100">`tesseract-js`</span>.</h6>
							</li>
							<li className="space-y-2">
								<div className="flex md:flex-col flex-row items-center md:gap-0 gap-4">

									<AiFillProduct className="text-5xl text-amber-400" />
									<h3 className="font-clash font-medium text-xl">DOCX</h3>
								</div>
								<h6 className="text-sm text-background">These files are run through <span className="text-amber-100">`mammoth`</span> which is a dependency extracts the text from the file.</h6>
							</li>
							<li className="space-y-2">
								<div className="flex md:flex-col flex-row items-center md:gap-0 gap-4">

									<AiFillProduct className="text-5xl text-amber-400 rotate-90" />
									<h3 className="font-clash font-medium text-xl">PPTX</h3>
								</div>
								<h6 className="text-sm text-background">PPTX files are made from XML files so the only process necessary is using <span className="text-amber-100">`JSZIP`</span> to unzip and loop through the slides and cut out formatting elements.</h6>
							</li>
							<li className="space-y-2">
								<div className="flex md:flex-col flex-row items-center md:gap-0 gap-4">
									<AiFillProduct className="text-5xl text-amber-400 rotate-180" />
									<h3 className="font-clash font-medium text-xl">Summarization</h3>
								</div>
								<h6 className="text-sm text-background">The AI used is hosted in Hugging Face and switches models based on the length of the file. Uses <span className="text-amber-100">`sshleifer/distilbart-cnn-12-6`</span> and <span className="text-amber-100">`pszemraj/led-large-book-summary`</span></h6>
							</li>
						</ul>
					</div>
				</section>

				<footer className="bg-background w-full">
					<Link className="font-clash text-xl text-center py-4 w-full inline-block hover:underline" href="https://github.com/shijisan">@shijisan</Link>
				</footer>

			</main>
		</>
	)
}