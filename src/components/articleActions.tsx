import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ArticleActions() {
  const [likes, setLikes] = useState(0);

  return (
    <div className="mt-8 flex items-center justify-between">
      <Button
        onClick={() => setLikes(likes + 1)}
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
      >
        Like this article ({likes})
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
  );
}
