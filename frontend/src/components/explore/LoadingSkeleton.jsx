import React from 'react';

export default function LoadingSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="rounded-3xl bg-white/70 backdrop-blur-md border border-[#0F5D46]/10 overflow-hidden shadow-sm flex flex-col animate-pulse"
        >
          {/* Shimmer Image Box */}
          <div className="h-48 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 relative overflow-hidden">
            <div className="absolute top-4 left-4 h-6 w-20 bg-white/60 rounded-full" />
            <div className="absolute top-4 right-4 h-6 w-16 bg-white/60 rounded-full" />
          </div>

          {/* Card Body */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-24 bg-gray-200 rounded-md" />
                <div className="h-3 w-16 bg-gray-200 rounded-md" />
              </div>

              <div className="h-5 w-4/5 bg-gray-300 rounded-md mb-2" />
              <div className="h-3.5 w-full bg-gray-200 rounded-md mb-1.5" />
              <div className="h-3.5 w-3/4 bg-gray-200 rounded-md mb-4" />
            </div>

            <div className="pt-4 border-t border-gray-100 mt-2">
              <div className="flex justify-between items-center mb-4">
                <div className="h-5 w-20 bg-gray-200 rounded-md" />
                <div className="h-4 w-16 bg-gray-200 rounded-md" />
              </div>
              <div className="flex gap-2">
                <div className="h-10 flex-1 bg-gray-200 rounded-xl" />
                <div className="h-10 w-10 bg-gray-200 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
