"use client"

import mammoth from "mammoth";

export async function extractDocxText (file: File){
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value; 
};
