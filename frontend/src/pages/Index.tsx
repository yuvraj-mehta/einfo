import AuthButton from "@/components/AuthButton";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center">
        <Logo />
        <AuthButton />
      </nav>

      {/* Main Content - Centered */}
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 -mt-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Centralized Logo */}
          <div className="flex justify-center mb-10">
            <img 
              src="/logo.png" 
              alt="e-info.me logo" 
              className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain"
            />
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Your Digital Identity, Simplified
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 leading-relaxed max-w-xl mx-auto">
            Create a beautiful, unified profile to share all your work and
            links.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={() => navigate("/dashboard")}
            >
              Get Started
            </Button>
            <Link to="/demo" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
