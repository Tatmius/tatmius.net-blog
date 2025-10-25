"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ArticleActions() {
  const [likes, setLikes] = useState(0);

  return (
    <div className="mt-8 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button onClick={() => setLikes(likes + 1)} className="button-primary">
          Like({likes})
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            alert(
              "Thank you for your interest! Sharing functionality coming soon."
            )
          }
        >
          Share
        </Button>
      </div>
    </div>
  );
}
