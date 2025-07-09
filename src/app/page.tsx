"use client";
import React, { useState } from "react";
import { uploadPdf } from "../api";

export default function HomePage() {
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setLoading(true);
    setAbstract("");
    setKeywords([]);

    try {
      const data = await uploadPdf(e.target.files[0]);
      setAbstract(data.abstract);
      setKeywords(data.keywords);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4">
      <h1>Scientific KPG</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      {loading && <p>Uploading and extracting...</p>}

      {abstract && (
        <>
          <h2>Abstract</h2>
          <p>{abstract}</p>
        </>
      )}

      {keywords.length > 0 && (
        <>
          <h2>Keywords</h2>
          <ul>
            {keywords.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
