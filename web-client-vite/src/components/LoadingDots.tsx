const LoadingDots = () => {
  return (
    <div className="flex items-center space-x-2 justify-center">
      <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.45s]"></div>
      <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
    </div>
  )
}

export default LoadingDots