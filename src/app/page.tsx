"use client";
import React, { useState } from "react";
import { uploadPdf } from "../api";

export default function HomePage() {
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isTwoColumn, setIsTwoColumn] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSend = async () => {
  if (!file) return;

  setLoading(true);
  setAbstract("");
  setKeywords([]);

  try {
    const data = await uploadPdf(file, isTwoColumn);
    setAbstract(data.abstract);
    setKeywords(data.keywords);
  } catch (error) {
    console.error("Upload failed", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen p-8"
      style={{ background: "var(--background)" }}
    >
      <h1
        className="absolute top-4 left-4 text-3xl font-semibold"
        style={{ color: "var(--foreground)" }}
      >
        Patara
        <span className="px-2 text-sm font-normal text-gray-500">v0.0.1</span>
      </h1>

      <div
        className="w-80 h-40 border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer mb-4 rounded-lg"
        style={{ background: "var(--background)"}}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        {file ? <p>{file.name}</p> : <p>Drag & drop or click to select PDF</p>}
        <input
          id="fileInput"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="flex items-center mb-4">
        <label className="mr-2 font-medium">2-column PDF?</label>
        <button
          onClick={() => setIsTwoColumn(!isTwoColumn)}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200
            ${isTwoColumn ? "bg-[#E3EEB2]" : "bg-[#4E6688]"}`}
        >
          <div
            className={`w-4 h-4 rounded-full shadow-md transform transition-transform duration-200
              ${isTwoColumn ? "translate-x-6 bg-[#332D56]" : "translate-x-0 bg-white"}`}
          />
        </button>
      </div>

      <button
        onClick={handleSend}
        disabled={!file || loading}
        className="px-6 py-2 bg-[#E3EEB2] text-[#332D56] rounded-3xl hover:bg-[#71C0BB] disabled:bg-[#4E6688] transition font-semibold"
      >
        {loading ? "Sending..." : "Send"}
      </button>

      {abstract && (
        <div className="mt-8 max-w-xl text-left">
          <h2 className="text-xl font-bold mb-2">Abstract</h2>
          <p className="mb-4">{abstract}</p>

          <h2 className="text-xl font-bold mb-2">Keywords</h2>
          <ul className="list-disc list-inside">
            {keywords.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
