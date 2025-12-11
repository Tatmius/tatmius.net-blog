"use client";

import React from "react";
import { FlashCardGrid } from "@/components/flash-card/flash-card-grid";
import { consonants, vowels } from "./hangeul-data";

export function HangeulCards() {
  const cards = [
    {
      id: "consonants",
      sideA: <div className="text-3xl font-bold">子音</div>,
      sideB: (
        <div className="flex flex-wrap gap-4 p-4 justify-center">
          {consonants.map((char) => (
            <span key={char} className="text-4xl font-bold">
              {char}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: "vowels",
      sideA: <div className="text-3xl font-bold">母音</div>,
      sideB: (
        <div className="flex flex-wrap gap-4 p-4 justify-center">
          {vowels.map((char) => (
            <span key={char} className="text-4xl font-bold">
              {char}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div>
      <FlashCardGrid
        cards={cards}
        sideAWidthRatio={0.3}
        gridClassName="grid-cols-1"
        defaultMode="showA"
        modeLabels={{
          showA: "分類を表示",
          showB: "文字を表示",
          showBoth: "両方表示",
          hideBoth: "両方隠す",
        }}
      />
    </div>
  );
}
