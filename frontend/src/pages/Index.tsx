import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/AuthButton";
import Footer from "@/components/Footer";

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
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Showcase Your Developer Identity in One Link
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
