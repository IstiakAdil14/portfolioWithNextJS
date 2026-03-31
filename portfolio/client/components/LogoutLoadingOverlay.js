import React from "react";

const LogoutLoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-transparent animate-fadeIn">
      <div className="bg-white bg-opacity-30 dark:bg-gray-900 dark:bg-opacity-30 p-12 rounded-3xl shadow-[0_0_20px_rgba(124,58,237,0.7)] w-full max-w-md text-center transition-transform transform hover:scale-105">
        <div className="flex flex-col items-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 dark:border-gray-700 h-20 w-20 mb-8 animate-spin border-red-600 dark:border-red-400 shadow-lg"></div>
          <h2 className="text-4xl font-extrabold mb-6 text-red-700 dark:text-red-400 tracking-wider flex items-center justify-center">
            Logging Out
            <span className="dots ml-3 text-red-600 dark:text-red-300 font-extrabold text-4xl animate-pulse">
              ...
            </span>
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg font-medium">
            Please wait while we log you out.
          </p>
          <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 dark:bg-red-500 animate-progressBar"></div>
          </div>
        </div>
        <style jsx>{`
          .loader {
            border-top-color: #dc2626; /* Tailwind red-600 */
            box-shadow: 0 0 15px #dc2626;
          }
          .dots {
            animation: pulse 1.5s infinite;
          }
          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.3;
            }
          }
          @keyframes progressBar {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }
          .animate-progressBar {
            animation: progressBar 2s linear forwards;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in forwards;
          }
        `}</style>
      </div>
    </div>
  );
};

export default LogoutLoadingOverlay;
