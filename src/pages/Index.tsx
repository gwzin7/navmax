
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginButton from "@/components/LoginButton";
import LanguageButton from "@/components/LanguageButton";
import AddressBar from "@/components/AddressBar";
import BrowserContent from "@/components/BrowserContent";
import { useLanguage } from "@/language/LanguageContext";
import { Settings, Mail, Bookmark, History, User, Brain, Download, Layout, Shield, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import HomePage from "@/components/HomePage";

const Index = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [pageTitle, setPageTitle] = useState("NavMAX");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidDomain, setIsValidDomain] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const { translate } = useLanguage();

  // Update document title when page title changes
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} - NavMAX` : "NavMAX";
  }, [pageTitle]);

  const handleNavigate = (newUrl: string, isValid: boolean) => {
    setUrl(newUrl);
    setIsValidDomain(isValid);
  };

  const handleRefresh = () => {
    // In a real electron app, we would refresh the webContents
    setIsLoading(true);
    // Force re-render of the iframe by toggling the URL
    const currentUrl = url;
    setUrl("");
    setTimeout(() => setUrl(currentUrl), 100);
  };

  const handleHome = () => {
    setUrl("");
    setPageTitle("NavMAX");
  };

  const handleGoBack = () => {
    // In a real electron app, we would navigate back in webContents
    console.log("Go back");
    setCanGoForward(true);
  };

  const handleGoForward = () => {
    // In a real electron app, we would navigate forward in webContents
    console.log("Go forward");
  };

  const navigateToPage = (route: string) => {
    navigate(route);
  };

  // Navigation menu items
  const navItems = [
    { icon: <Home size={18} />, title: "Início", route: "/", id: "home-nav" },
    { icon: <Bookmark size={18} />, title: "Favoritos", route: "/bookmarks", id: "bookmarks-nav" },
    { icon: <History size={18} />, title: "Histórico", route: "/history", id: "history-nav" },
    { icon: <User size={18} />, title: "Perfis", route: "/profiles", id: "profiles-nav" },
    { icon: <Brain size={18} />, title: "Assistente IA", route: "/ai", id: "ai-nav" },
    { icon: <Download size={18} />, title: "Downloads", route: "/downloads", id: "downloads-nav" },
    { icon: <Mail size={18} />, title: "Email", route: "/mail", id: "email-nav" },
    { icon: <Layout size={18} />, title: "Tela Dividida", route: "/split-screen", id: "split-screen-nav" },
    { icon: <Shield size={18} />, title: "Privacidade", route: "/privacy", id: "privacy-nav" },
    { icon: <Settings size={18} />, title: "Configurações", route: "/settings", id: "settings-nav" },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Browser Chrome */}
      <div className="bg-navmax-muted border-b border-navmax-light">
        {/* Top Bar with Login */}
        <div className="flex justify-between items-center p-2">
          <div className="flex items-center">
            <h2 className="text-lg font-bold">
              <span className="text-navmax-accent">NAV</span>
              <span>MAX</span>
            </h2>
          </div>
          
          {/* Quick Access Buttons */}
          <div className="flex-1 flex items-center justify-center gap-1 mx-4 overflow-x-auto hide-scrollbar">
            {navItems.map((item) => (
              <Button 
                key={item.route}
                variant="ghost" 
                size="sm" 
                className={`nav-button flex items-center gap-1 whitespace-nowrap ${
                  window.location.pathname === item.route ? 'text-navmax-accent bg-navmax-accent/10' : ''
                }`}
                onClick={() => navigateToPage(item.route)}
                title={item.title}
                id={item.id}
              >
                {item.icon}
                <span className="hidden md:inline text-sm">{item.title}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageButton />
            <LoginButton />
          </div>
        </div>
        
        {/* Address Bar */}
        <AddressBar
          onNavigate={handleNavigate}
          onRefresh={handleRefresh}
          onHome={handleHome}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onGoBack={handleGoBack}
          onGoForward={handleGoForward}
        />
      </div>
      
      {/* Browser Content Area */}
      {!url ? (
        <HomePage />
      ) : (
        <BrowserContent 
          url={url}
          isValidDomain={isValidDomain}
          onTitleChange={setPageTitle}
          onLoadingChange={setIsLoading}
          onNavigationChange={(back, forward) => {
            setCanGoBack(back);
            setCanGoForward(forward);
          }}
        />
      )}
      
      {/* Footer / Brand */}
      <div className="px-4 py-2 bg-navmax border-t border-navmax-light flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          <span>NavMAX • {new Date().getFullYear()}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          <span>Desenvolvido por </span>
          <span className="font-bold">NavMAX</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
