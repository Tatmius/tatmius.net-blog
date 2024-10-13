import React from "react";
import "highlight.js/styles/github-dark.css";

interface MdxWrapperProps {
  children: React.ReactNode;
}

export function MdxWrapper({ children }: MdxWrapperProps) {
  return (
    <div className="prose prose-custom dark:prose-custom-dark prose-sm sm:prose sm:max-w-none md:prose-base lg:prose-lg max-w-none mt-4">
      {children}
    </div>
  );
}
