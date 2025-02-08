import { useLogto } from "@logto/react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { appConfig, encoreApiEndpoint } from "../config/logto";

export function ProtectedResource() {
  const { isAuthenticated, getAccessToken } = useLogto();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProtectedResource = async () => {
    setIsLoading(true);
    setError("");
    try {
      const accessToken = await getAccessToken(appConfig.apiResourceIndicator);
      const response = await fetch(`${encoreApiEndpoint}/api/hello`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMessage(JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching protected resource:", error);
      setError("Failed to fetch protected resource. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Protected Resource
        </h2>

        <div className="space-y-6">

          {message && !error && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-green-900 mb-2">
                Response from Protected API
              </h3>
              <pre className="text-green-700 whitespace-pre-wrap break-words">
                {message}
              </pre>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={fetchProtectedResource}
              disabled={isLoading}
              className={`
                px-6 py-3 rounded-md text-white font-medium
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }
              `}
            >
              {isLoading ? "Loading..." : "Fetch protected resource"}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
