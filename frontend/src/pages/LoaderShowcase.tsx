import React, { useState } from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PageLoader } from "@/components/common/PageLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LoaderShowcase: React.FC = () => {
  const [showFullPage, setShowFullPage] = useState(false);
  const [buttonLoading, setButtonLoading] = useState<string | null>(null);

  const handleShowFullPage = () => {
    setShowFullPage(true);
    // Hide the full page loader after 3 seconds
    setTimeout(() => setShowFullPage(false), 3000);
  };

  const handleButtonDemo = (buttonId: string) => {
    setButtonLoading(buttonId);
    setTimeout(() => setButtonLoading(null), 2000);
  };

  if (showFullPage) {
    return <PageLoader message="Turning Personality into Pixels..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            💫 Minimal Loading Experience
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            "Turning Personality into Pixels..." - A unified, minimal loading experience for your digital identity platform.
          </p>
          
          <Button 
            onClick={handleShowFullPage}
            className="bg-slate-900 hover:bg-slate-800"
          >
            � View Full Experience
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Full Page Loader */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg">Full Page Loader</CardTitle>
              <CardDescription>For page transitions and major loading states</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-48 bg-white rounded-lg border relative overflow-hidden">
                {/* Minimal animated dots that fade in and out */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-black rounded-full animate-fade-in-out"></div>
                  <div className="absolute bottom-1/4 right-1/3 w-0.5 h-0.5 bg-gray-600 rounded-full animate-drift"></div>
                  <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-gray-800 rounded-full animate-fade-in-out" style={{ animationDelay: '1s' }}></div>
                </div>
                
                <div className="text-center space-y-4 relative z-10">
                  <img 
                    src="/logo.png" 
                    alt="Logo" 
                    className="w-12 h-12 mx-auto object-contain animate-pulse"
                    style={{
                      filter: 'brightness(0)',
                      animation: 'logo-fade 2s ease-in-out infinite'
                    }}
                  />
                  <LoadingSpinner size="lg" />
                  <p className="text-sm text-gray-800 font-light">Turning Personality into Pixels...</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inline Loader */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg">Inline Loaders</CardTitle>
              <CardDescription>For buttons, forms, and smaller components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-48 bg-white rounded-lg border">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <LoadingSpinner size="lg" />
                    <span className="text-gray-700">Large size</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <LoadingSpinner size="md" />
                    <span className="text-gray-700">Medium size</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <LoadingSpinner size="sm" />
                    <span className="text-gray-700">Small size</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Interactive Examples</CardTitle>
            <CardDescription>See how loaders work in real application scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Button Examples */}
              <div>
                <h4 className="font-semibold mb-3">Button Loading States:</h4>
                <div className="flex gap-4 flex-wrap">
                  <Button 
                    disabled={buttonLoading === 'signin'}
                    onClick={() => handleButtonDemo('signin')}
                    className="flex items-center gap-2"
                  >
                    {buttonLoading === 'signin' && <LoadingSpinner size="sm" />}
                    {buttonLoading === 'signin' ? 'Signing in...' : 'Sign In'}
                  </Button>
                  <Button 
                    variant="outline" 
                    disabled={buttonLoading === 'save'}
                    onClick={() => handleButtonDemo('save')}
                    className="flex items-center gap-2"
                  >
                    {buttonLoading === 'save' && <LoadingSpinner size="sm" />}
                    {buttonLoading === 'save' ? 'Saving...' : 'Save Profile'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    disabled={buttonLoading === 'upload'}
                    onClick={() => handleButtonDemo('upload')}
                    className="flex items-center gap-2"
                  >
                    {buttonLoading === 'upload' && <LoadingSpinner size="sm" />}
                    {buttonLoading === 'upload' ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
              </div>

              {/* Code Examples */}
              <div>
                <h4 className="font-semibold mb-2">Code Usage:</h4>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`// Full page loading
<PageLoader message="Turning Personality into Pixels..." />

// Inline loading spinner
<LoadingSpinner size="md" />

// In buttons
<Button disabled={isLoading}>
  {isLoading && <LoadingSpinner size="sm" />}
  {isLoading ? 'Processing...' : 'Submit'}
</Button>`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Design Principles</CardTitle>
            <CardDescription>What makes this loading experience special for E-Info</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs">🎯</span>
                  </div>
                  <div>
                    <h5 className="font-medium">Unified Experience</h5>
                    <p className="text-gray-600 text-sm">One beautiful loading style - "Turning Personality into Pixels..."</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs">✨</span>
                  </div>
                  <div>
                    <h5 className="font-medium">Brand Aligned</h5>
                    <p className="text-gray-600 text-sm">Deep blues and elegant animations that match your digital identity theme</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-xs">🔧</span>
                  </div>
                  <div>
                    <h5 className="font-medium">Consistent Experience</h5>
                    <p className="text-gray-600 text-sm">Same beautiful experience across your entire platform</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-600 text-xs">�</span>
                  </div>
                  <div>
                    <h5 className="font-medium">Meaningful Message</h5>
                    <p className="text-gray-600 text-sm">Every loading screen reinforces your brand promise</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};export default LoaderShowcase;
