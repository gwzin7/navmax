
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LanguageSettings from "./pages/LanguageSettings";
import { LanguageProvider } from "./language/LanguageContext";
import { AuthProvider } from "./auth/AuthContext";
import HistoryPage from "./components/HistoryPage";
import BookmarksPage from "./components/BookmarksPage";
import SettingsPage from "./components/SettingsPage";
import EmailPage from "./components/EmailPage";
import MultiUserPage from "./components/MultiUserPage";
import ExtensionsPage from "./components/ExtensionsPage";
import VoiceCommandPage from "./components/VoiceCommandPage";
import DownloadManagerPage from "./components/DownloadManagerPage";
import FocusModePage from "./components/FocusModePage";
import SplitScreenPage from "./components/SplitScreenPage";
import OfflinePagesPage from "./components/OfflinePagesPage";
import PrivacySecurityPage from "./components/PrivacySecurityPage";
import IncognitoPage from "./components/IncognitoPage";
import NavmaxAIPage from "./components/NavmaxAIPage";
import RegisterPage from "./components/RegisterPage";
import { useEffect } from "react";
import { Download } from "lucide-react";

const queryClient = new QueryClient();

// Function to check if the app is running inside Electron (for download button)
const isRunningInElectron = () => {
  return window.navigator.userAgent.toLowerCase().indexOf('electron') > -1;
};

const App = () => {
  // Add theme detection and persistence (light/dark mode)
  useEffect(() => {
    // Check for theme in localStorage
    const savedTheme = localStorage.getItem('navmax-theme');
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);
    } else {
      // Default to dark theme
      document.documentElement.classList.add('dark');
      localStorage.setItem('navmax-theme', 'dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Main Navigation */}
                <Route path="/" element={<Index />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/profiles" element={<MultiUserPage />} />
                <Route path="/downloads" element={<DownloadManagerPage />} />
                <Route path="/ai" element={<NavmaxAIPage />} />
                <Route path="/mail" element={<EmailPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/privacy" element={<PrivacySecurityPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Additional Features */}
                <Route path="/extensions" element={<ExtensionsPage />} />
                <Route path="/voice" element={<VoiceCommandPage />} />
                <Route path="/focus" element={<FocusModePage />} />
                <Route path="/split-screen" element={<SplitScreenPage />} />
                <Route path="/offline-pages" element={<OfflinePagesPage />} />
                <Route path="/incognito" element={<IncognitoPage />} />
                
                {/* Settings Pages */}
                <Route path="/language-settings" element={<LanguageSettings />} />
                
                {/* Not Found (404) Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            
            {/* Show download button if not running in Electron */}
            {!isRunningInElectron() && (
              <div className="fixed bottom-4 left-4 z-50">
                <a 
                  href="https://navmax.com/download" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-navmax-accent hover:bg-navmax-accent/80 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
                  id="download-button"
                >
                  <Download size={18} />
                  <span>Baixar NavMAX</span>
                </a>
              </div>
            )}
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
