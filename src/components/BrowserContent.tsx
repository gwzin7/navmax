
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import HomePage from "./HomePage";
import { isUrlWhitelisted } from "@/security/whitelistSystem";

interface BrowserContentProps {
  url: string;
  isValidDomain: boolean;
  onTitleChange: (title: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onNavigationChange: (canGoBack: boolean, canGoForward: boolean) => void;
}

const BrowserContent = ({ 
  url, 
  isValidDomain,
  onTitleChange,
  onLoadingChange,
  onNavigationChange
}: BrowserContentProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Handle loading state changes and notify parent
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        onLoadingChange(false);
      }, 800); // Simulated loading time
      return () => clearTimeout(timer);
    }
  }, [loading, onLoadingChange]);

  // Set initial navigation state
  useEffect(() => {
    // In a real browser, we would track actual navigation state
    onNavigationChange(false, false);
  }, [onNavigationChange]);

  // Handle changes to URL
  useEffect(() => {
    if (url) {
      setLoading(true);
      onLoadingChange(true);

      // If it's a valid URL, we'd update the title based on the page
      if (isValidDomain) {
        // Extract domain for title
        try {
          const domain = new URL(url).hostname;
          onTitleChange(domain);
        } catch (e) {
          onTitleChange("NavMAX Browser");
        }
      }
    } else {
      // If no URL, we're on the homepage
      onTitleChange("NavMAX Browser");
    }
  }, [url, isValidDomain, onTitleChange, onLoadingChange]);

  const handleReturnHome = () => {
    navigate("/");
  };

  // Check if this is a search URL and extract the query
  const getSearchTermFromUrl = () => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === "www.intellinax.com.br" && urlObj.pathname === "/search") {
        return urlObj.searchParams.get("q") || "";
      }
      if (urlObj.hostname === "www.google.com" && urlObj.pathname === "/search") {
        return urlObj.searchParams.get("q") || "";
      }
      return "";
    } catch (e) {
      return "";
    }
  };

  // Show error page for invalid domains
  if (url && !isValidDomain) {
    return <ErrorPage url={url} onReturnHome={handleReturnHome} />;
  }

  // Show homepage when no URL is entered
  if (!url) {
    return <HomePage />;
  }

  // In a real app, this would be an iframe or webview
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay">
      <div className="text-center max-w-2xl p-8">
        <h2 className="text-2xl font-bold mb-4">
          {loading ? "Carregando..." : "Navegando"}
        </h2>
        <p className="text-lg mb-6 break-all">
          {url}
        </p>
        
        {getSearchTermFromUrl() && (
          <div className="mb-6 p-4 border border-navmax-accent/30 rounded-lg">
            <p className="text-sm mb-2">Termo de pesquisa:</p>
            <p className="text-xl font-medium">{getSearchTermFromUrl()}</p>
            <p className="text-xs mt-2 text-muted-foreground">
              Via {url.includes("intellinax.com.br") ? "NavMAX" : "Google"} Search
            </p>
          </div>
        )}
        
        <div className="p-4 border border-navmax-light bg-navmax-dark rounded-xl">
          <p className="text-sm text-muted-foreground mb-2">
            Em um aplicativo Electron real, isto exibiria conteúdo da web usando um webview ou BrowserWindow
          </p>
          <div className="flex justify-center gap-2">
            <button 
              className="text-xs text-navmax-accent hover:underline"
              onClick={() => navigate("/ai")}
            >
              Analisar esta página com IA
            </button>
            <span className="text-xs text-navmax-foreground/40">|</span>
            <button 
              className="text-xs text-navmax-accent hover:underline"
              onClick={handleReturnHome}
            >
              Voltar para a Página Inicial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserContent;
