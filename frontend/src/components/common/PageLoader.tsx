import React from "react";

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = "Turning Personality into Pixels..." 
}) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Minimal animated dots that fade in and out */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-black rounded-full animate-fade-in-out"></div>
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-gray-600 rounded-full animate-drift"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-gray-800 rounded-full animate-fade-in-out" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-black rounded-full animate-drift" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-gray-700 rounded-full animate-fade-in-out" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-0.5 h-0.5 bg-gray-900 rounded-full animate-drift" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/6 right-1/6 w-1 h-1 bg-gray-500 rounded-full animate-fade-in-out" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-1/6 left-1/6 w-0.5 h-0.5 bg-black rounded-full animate-drift" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="text-center space-y-8 px-6 relative z-10">
        {/* Animated logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-16 h-16 object-contain animate-pulse"
            style={{
              filter: 'brightness(0)',
              animation: 'logo-fade 2s ease-in-out infinite'
            }}
          />
        </div>
        
        {/* Loading message */}
        <div className="space-y-6">
          <p className="text-base text-gray-800 font-light tracking-wide">
            {message}
          </p>
          <div className="flex justify-center space-x-1">
            <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
