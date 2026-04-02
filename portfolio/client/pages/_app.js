import "../styles/globals.css";
import { DarkModeProvider } from "../context/DarkModeContext";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
    }
    const handleRouteChange = () => window.scrollTo(0, 0);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router]);
  return (
    <AuthProvider>
      <DarkModeProvider>
        <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
          <Navbar />
          <Component {...pageProps} />
        </div>
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default MyApp;
