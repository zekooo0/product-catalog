import LoadingSpinner from "./LoadingSpinner";

interface LoadingStateProps {
  fullScreen?: boolean;
  message?: string;
  className?: string;
}

export default function LoadingState({ 
  fullScreen = true,
  message = "Loading...",
  className = "",
}: LoadingStateProps) {
  const height = fullScreen ? "h-screen" : "h-[400px]";
  
  return (
    <div className={`flex items-center justify-center w-full ${height} ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
