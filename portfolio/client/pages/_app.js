import "../styles/globals.css";
import { DarkModeProvider } from "../context/DarkModeContext";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }) {
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
