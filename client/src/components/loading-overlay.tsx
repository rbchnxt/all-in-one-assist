interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  description?: string;
}

export function LoadingOverlay({ 
  isVisible, 
  message = "Processing your request...", 
  description = "This may take a few seconds" 
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">{message}</p>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
}
