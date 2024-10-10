import React from "react";

interface BlogProps {
  child: React.ReactNode;
}

export default function Blog({}: BlogProps) {
  return (
    <div>
      <h1>Blog</h1>
    </div>
  );
}
