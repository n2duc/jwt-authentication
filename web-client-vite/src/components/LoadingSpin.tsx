const LoadingSpin = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
      <p className="text-lg font-semibold text-gray-900">Loading...</p>
    </div>
  );
};

export default LoadingSpin;
