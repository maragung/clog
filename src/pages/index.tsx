// src/app/page.tsx

import React from "react";
import fs from "fs";
import path from "path";
import Link from "next/link";

interface NodePageProps {
  files: string[];
}

const Home: React.FC<NodePageProps> = ({ files = ["massa.tsx"] }) => {
  return (
    <div className="page-container">
      <h1 className="title">Validator & Stake</h1>
      <div className="grid-container">
        {files.map((file) => (
          <Link key={file} href={`/nodes/${file.replace(/\.tsx$/, "")}`}>
            <div className="card-link">
              <div className="card">
                <img
                  src={`/${file.replace(/\.tsx$/, ".png")}`} 
                  alt="Logo"
                  className="card-logo"
                />
                <div className="card-title">{formatTitle(file)}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .page-container {
          max-width: 95vw;
          margin: 5vh auto;
          padding: 20px;
          background-color: #ffffff; /* Warna Putih */
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 90vh; 
        }

        .title {
          color: #3498db; /* Warna Biru */
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .card-link {
          text-decoration: none;
          color: inherit;
          flex: 1; /* Mempertahankan lebar yang sama untuk setiap item di dalam grid */
        }

        .card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          background-color: #ffffff; /* Warna Putih */
          border: 1px solid #ddd; /* Garis tepi */
          border-radius: 8px;
          transition: box-shadow 0.3s ease;
        }

        .card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .card-logo {
          width: 64px; /* Sesuaikan dengan ukuran logo */
          height: 64px; /* Sesuaikan dengan ukuran logo */
          object-fit: contain;
          margin-bottom: 10px;
        }

        .card-title {
          text-align: center;
          text-transform: capitalize; /* Mengubah setiap huruf awal kata menjadi huruf besar */
        }

        @media only screen and (max-width: 600px) {
          /* Styles untuk layar berukuran kecil */
          .grid-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

function formatTitle(filename: string): string {
  return filename
    .replace(/\.tsx$/, "")
    .replace(/(\b\w)/g, (match) => match.toUpperCase());
}


export default Home;
