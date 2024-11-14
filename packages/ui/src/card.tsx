import React from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/30 shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h2>
        <div className="text-gray-700 dark:text-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}