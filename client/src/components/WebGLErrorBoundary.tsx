import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a WebGL-related error
    const isWebGLError = 
      error.message.includes("WebGL") ||
      error.message.includes("webgl") ||
      error.message.includes("context") ||
      error.message.includes("WEBGL_CONTEXT_LOST_WEBGL") ||
      error.message.includes("Cannot read properties of null");

    if (isWebGLError) {
      return {
        hasError: true,
        errorMessage: error.message
      };
    }

    // Re-throw non-WebGL errors
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("WebGL Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-400 to-green-400 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="text-6xl mb-4">🎮</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              3D Support Not Available
            </h1>
            <p className="text-gray-600 mb-6">
              Your device doesn't support the 3D graphics needed for this farming game. 
              This might happen on older devices or when hardware acceleration is disabled.
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <p><strong>Try these solutions:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-left">
                <li>Update your browser to the latest version</li>
                <li>Enable hardware acceleration in browser settings</li>
                <li>Try using a different browser (Chrome, Firefox, Safari)</li>
                <li>Use a device with better 3D graphics support</li>
              </ul>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              Try Again
            </button>
            <div className="mt-4 text-xs text-gray-400">
              Error: {this.state.errorMessage}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WebGLErrorBoundary;