"use client";

import { PixiStage } from "./components/PixiStage";
import { useRef } from "react";

const GRID_SIZE = 800;
const rows = 8;
const columns = 10;
const gridSquarePixelSize = 91 

export default function Home() {
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      {/* 800×800 CSS grid container */}
      <div
        ref={parentRef}
        className="relative border border-neutral-700 rounded-lg overflow-hiddenx bg-neutral-950x"
        style={{
          display: "grid",
          width: GRID_SIZE,
          height: GRID_SIZE,
          gridTemplateColumns: `${gridSquarePixelSize}px`,
          gridTemplateRows: `${gridSquarePixelSize}px`,
        }}
      >
        {/* Pixi canvas absolutely positioned over the grid */}
        <div
          className="grid absolute top-0 left-0 bottom-0 right-0 z-10 overflow-hiddenx pointer-events-none"
          style={{ 
            width: GRID_SIZE, 
            height: GRID_SIZE, 
            gridTemplateColumns: `repeat(${columns}, ${gridSquarePixelSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${gridSquarePixelSize}px)`,
          }}
        >
          {Array.from({ length: rows * columns }, (_, index) => (
            <div
              key={index}
              className="border flex items-center justify-center border-black/20"
              style={{
                width: `${gridSquarePixelSize}px`,
                height: `${gridSquarePixelSize}px`,
              }}
            />)
          )}
        </div>
        <PixiStage />
      </div>
    </main>
  );
}
