"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type FlashCardMode = "showA" | "showB" | "showBoth" | "hideBoth";

export interface FlashCardData {
  id: string;
  sideA: React.ReactNode;
  sideB: React.ReactNode;
}

export interface FlashCardProps {
  data: FlashCardData;
  mode: FlashCardMode;
  className?: string;
  sideAWidthRatio?: number; // 0.0-1.0の範囲でA面の幅比率を指定（デフォルト: 0.5）
}

export function FlashCard({
  data,
  mode,
  className,
  sideAWidthRatio = 0.5,
}: FlashCardProps) {
  const [hideA, setHideA] = React.useState(mode === "showB");
  const [hideB, setHideB] = React.useState(mode === "showA");

  // モードが変更されたときに、デフォルトの表示状態を更新
  React.useEffect(() => {
    if (mode === "showA") {
      setHideA(false);
      setHideB(true);
    } else if (mode === "showB") {
      setHideA(true);
      setHideB(false);
    } else if (mode === "showBoth") {
      setHideA(false);
      setHideB(false);
    } else if (mode === "hideBoth") {
      setHideA(true);
      setHideB(true);
    }
  }, [mode]);

  // A面とB面の幅比率を計算（0.0-1.0の範囲に制限）
  const ratioA = Math.max(0, Math.min(1, sideAWidthRatio));
  const ratioB = 1 - ratioA;

  // CSS Gridのテンプレート列を動的に生成
  const gridTemplateColumns = `${ratioA}fr ${ratioB}fr`;

  // 面の設定を配列で定義
  const sides = [
    {
      id: "A",
      content: data.sideA,
      hidden: hideA,
      setHidden: setHideA,
      contentClassName: "text-2xl font-bold text-center",
      containerClassName: "flex items-center justify-center",
    },
    {
      id: "B",
      content: data.sideB,
      hidden: hideB,
      setHidden: setHideB,
      contentClassName: "text-base",
      containerClassName: "",
    },
  ];

  return (
    <Card className={cn("w-full border-0", className)}>
      <CardContent className="py-2 px-4">
        <div className="grid gap-2" style={{ gridTemplateColumns }}>
          {sides.map((side) => (
            <div
              key={side.id}
              className="relative cursor-pointer"
              onClick={() => side.setHidden(!side.hidden)}
            >
              <div
                className={cn(
                  "min-h-[80px] p-2 rounded-lg border-2 transition-all duration-100",
                  side.containerClassName,
                  side.hidden
                    ? "border-primary/30"
                    : "border-primary/50 bg-card"
                )}
              >
                <div
                  className={
                    side.hidden ? "opacity-70 blur-lg pointer-events-none" : ""
                  }
                >
                  <div className={side.contentClassName}>{side.content}</div>
                </div>
              </div>
              <div
                className="absolute top-1 right-1 p-1 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  side.setHidden(!side.hidden);
                }}
                aria-label={
                  side.hidden ? `${side.id}面を表示` : `${side.id}面を隠す`
                }
                role="button"
                tabIndex={0}
              >
                {side.hidden ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
