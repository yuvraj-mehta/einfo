import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LinkButtonProps {
  href: string;
  title: string;
  icon?: React.ReactNode;
  description?: string;
  onDirectLink?: () => void;
}

export default function LinkButton({
  href,
  title,
  icon,
  description,
  onDirectLink,
}: LinkButtonProps) {
  const handleClick = () => {
    if (onDirectLink) {
      onDirectLink();
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-white hover:bg-gray-50 border border-gray-100 rounded-xl transition-all duration-200 group shadow-sm overflow-hidden"
    >
      <div className="p-4 flex items-center gap-4 text-left">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 transition-colors duration-200">
          {icon || <ExternalLink className="w-4 h-4 text-gray-600" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-gray-900 font-medium text-sm">{title}</div>
          {description && (
            <div className="text-gray-500 text-xs mt-0.5 truncate">
              {description}
            </div>
          )}
        </div>

        {/* Arrow indicator */}
        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
      </div>
    </button>
  );
}
