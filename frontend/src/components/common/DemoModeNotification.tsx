import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, ExternalLink } from "lucide-react";
import { apiClient } from "@/services/apiClient";

interface DemoModeNotificationProps {
  className?: string;
}

export const DemoModeNotification = ({
  className,
}: DemoModeNotificationProps) => {
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(
    null,
  );
  const [isDismissed, setIsDismissed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const available = await apiClient.isBackendAvailable();
        setIsBackendConnected(available);
      } catch (error) {
        // Silently handle errors and assume backend is not available
        console.debug("Backend check failed in notification component");
        setIsBackendConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    // Add a small delay to avoid race conditions
    const timer = setTimeout(checkBackend, 100);

    return () => clearTimeout(timer);
  }, []);

  // Don't show if backend is connected, checking, or dismissed
  if (isChecking || isBackendConnected === true || isDismissed) {
    return null;
  }

  return (
    <Alert className={`bg-amber-50 border-amber-200 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800 pr-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <strong>Demo Mode Active</strong>
            <p className="text-sm mt-1">
              Backend is not connected. All features work with local storage
              only.
              <Button
                variant="link"
                className="h-auto p-0 ml-1 text-amber-700 underline"
                onClick={() =>
                  window.open("/BACKEND_IMPLEMENTATION_GUIDE.md", "_blank")
                }
              >
                Set up backend
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 text-amber-600 hover:text-amber-800"
            onClick={() => setIsDismissed(true)}
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DemoModeNotification;
