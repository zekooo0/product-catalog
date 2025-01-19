export default function LoadingState() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
