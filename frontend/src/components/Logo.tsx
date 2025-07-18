import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center group cursor-pointer">
      {/* Brand Text */}
      <div className="flex flex-col">
        <span className="text-gray-900 font-medium text-base leading-none tracking-normal group-hover:text-gray-700 transition-colors duration-200">
          e-info<span className="text-gray-700 font-normal">.me</span>
        </span>
        <span className="text-gray-500 text-xs font-normal leading-none mt-1">
          Connect & Share
        </span>
      </div>
    </Link>
  );
}
