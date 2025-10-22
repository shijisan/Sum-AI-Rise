# Next.js + Python Project

This project runs a **Next.js** frontend and a **Python** backend served with **Uvicorn**.

## Requirements

- **Chunking** – Split large files or text into manageable token-sized pieces.
- **UI Optimizations** – Enhance frontend components and overall user experience.

## Running the Project

### 1. Start the Python backend

```bash
cd py
.venv\Scripts\activate   # or `source .venv/bin/activate` on Unix
uvicorn main:app --reload
````

### 2. Start the Next.js frontend and file processors

```bash
cd /  # root of the project
npm install
npm run dev
```

### 3. Access the app

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Tip: You can also clone my Hugging Face Space to minimize traffic while testing.
