"use client"

import { useState } from "react"
import { FaRobot, FaUpload } from "react-icons/fa"

export default function Landing(){

  const [text, setText] = useState<string>("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Uploaded file", file);

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const { extractTextFromPDF } = await import("@/utils/extractPDF");
      const extractedText = await extractTextFromPDF(file);
      setText(extractedText);
      console.log("Extracted text:", extractedText);
    } else {
      alert("Please upload a PDF file.");
    }
  };


  return(
    <>
    <main>
      <header className="flex items-center justify-center w-full md:h-[75vh] flex-col space-y-8 min-h-screen">

        
        <form className="max-w-3xl w-full flex flex-col justify-center items-center space-y-4">

          <h1 className="font-clash text-6xl font-medium text-center">Sum-AI-Rise: Lesson Learned Easily <FaRobot className="inline -mt-4"/></h1>

          <h2 className="max-w-lg text-center">Turn your PDF, DOCX, or PPTX files summarized and give you examples to save you time and help you learn efficiently!</h2>

          <div className="relative w-fit">
            <button className="btn bg-amber-400 font-semibold py-3">Upload document <FaUpload/> </button>
            <input type="file" accept=".pdf, .docx, .pptx" onChange={handleUpload} className="opacity-0 absolute w-full h-full top-0 btn"/>
          </div>
          
        </form>

        {/* add top-right copy button */}
        <textarea className="min-h-64 bg-white rounded-2xl w-full max-w-3xl p-8" placeholder="Summarization goes here..." value={text} readOnly >
        </textarea>

      </header>

      <section className="min-h-screen bg-black">

      </section>

    </main>
    </>
  )
}