"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { FlashCard, FlashCardData, FlashCardMode } from "./flash-card";
import { cn } from "@/lib/utils";

export interface FlashCardGridProps {
  cards: FlashCardData[];
  className?: string;
  gridClassName?: string;
  sideAWidthRatio?: number; // 0.0-1.0の範囲でA面の幅比率を指定（デフォルト: 0.5）
  defaultMode?: FlashCardMode;
  modeLabels?: {
    showA?: string;
    showB?: string;
    showBoth?: string;
    hideBoth?: string;
  };
}

export function FlashCardGrid({
  cards,
  className,
  gridClassName,
  sideAWidthRatio = 0.5,
  defaultMode = "showA",
  modeLabels,
}: FlashCardGridProps) {
  const [mode, setMode] = React.useState<FlashCardMode>(defaultMode);

  const labels = {
    showA: "A面から表示",
    showB: "B面から表示",
    showBoth: "AB両面表示",
    hideBoth: "AB両面隠す",
    ...modeLabels,
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* モード切り替えボタン */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Button
          variant={mode === "showA" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("showA")}
        >
          {labels.showA}
        </Button>
        <Button
          variant={mode === "showB" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("showB")}
        >
          {labels.showB}
        </Button>
        <Button
          variant={mode === "showBoth" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("showBoth")}
        >
          {labels.showBoth}
        </Button>
        <Button
          variant={mode === "hideBoth" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("hideBoth")}
        >
          {labels.hideBoth}
        </Button>
      </div>

      {/* グリッドレイアウト */}
      <div className={cn("grid grid-cols-1 gap-2", gridClassName)}>
        {cards.map((card) => (
          <FlashCard
            key={card.id}
            data={card}
            mode={mode}
            sideAWidthRatio={sideAWidthRatio}
          />
        ))}
      </div>
    </div>
  );
}
