
import React, { useState } from "react";
import { EyeOff, Shield, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/language/LanguageContext";
import AddressBar from "./AddressBar";
import BrowserContent from "./BrowserContent";

const IncognitoPage = () => {
  const { translate } = useLanguage();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("NAVMAX - Incognito");
  const [canNavigate, setCanNavigate] = useState({ back: false, forward: false });

  const handleNavigate = (newUrl: string, isValid: boolean) => {
    if (isValid) {
      setUrl(newUrl);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#121212] bg-paper-texture bg-opacity-5 bg-blend-overlay">
      {/* Incognito Header */}
      <div className="p-4 bg-navmax-dark border-b border-purple-900/30 text-center">
        <div className="flex items-center justify-center mb-3">
          <div className="p-2 rounded-full bg-purple-500/20 mr-2">
            <EyeOff size={22} className="text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-purple-200">{translate("incognito.title")}</h2>
        </div>
        <p className="text-sm text-purple-300/80 max-w-2xl mx-auto">
          {translate("incognito.description")}
        </p>
      </div>
      
      {/* Address Bar with Incognito Styling */}
      <div className="p-2 bg-[#1a1a1a] border-b border-purple-900/30">
        <div className="flex items-center">
          <div className="flex items-center px-2 text-purple-400">
            <EyeOff size={16} />
          </div>
          <AddressBar 
            onNavigate={handleNavigate}
            onRefresh={() => setIsLoading(true)}
            onHome={() => setUrl("")}
            canGoBack={canNavigate.back}
            canGoForward={canNavigate.forward}
            onGoBack={() => console.log("Go back")}
            onGoForward={() => console.log("Go forward")}
          />
        </div>
      </div>
      
      {/* Browser Content */}
      <div className="flex-1 overflow-hidden">
        {url ? (
          <BrowserContent 
            url={url}
            isValidDomain={true}
            onTitleChange={setTitle}
            onLoadingChange={setIsLoading}
            onNavigationChange={(back, forward) => setCanNavigate({ back, forward })}
          />
        ) : (
          <div className="flex flex-col h-full items-center justify-center p-6 bg-[#121212]">
            <div className="p-4 rounded-full bg-purple-500/10 mb-6">
              <EyeOff size={64} className="text-purple-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-purple-200 mb-4">{translate("incognito.welcomeTitle")}</h1>
            <div className="max-w-xl text-center mb-10">
              <p className="text-purple-300/80 mb-4">
                {translate("incognito.welcomeDescription")}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-purple-900/30">
                <div className="p-3 rounded-full bg-purple-500/10 w-fit mb-4">
                  <EyeOff size={24} className="text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-purple-200 mb-2">{translate("incognito.feature1Title")}</h3>
                <p className="text-sm text-purple-300/70">
                  {translate("incognito.feature1Description")}
                </p>
              </div>
              
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-purple-900/30">
                <div className="p-3 rounded-full bg-purple-500/10 w-fit mb-4">
                  <Shield size={24} className="text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-purple-200 mb-2">{translate("incognito.feature2Title")}</h3>
                <p className="text-sm text-purple-300/70">
                  {translate("incognito.feature2Description")}
                </p>
              </div>
              
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-purple-900/30">
                <div className="p-3 rounded-full bg-purple-500/10 w-fit mb-4">
                  <Lock size={24} className="text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-purple-200 mb-2">{translate("incognito.feature3Title")}</h3>
                <p className="text-sm text-purple-300/70">
                  {translate("incognito.feature3Description")}
                </p>
              </div>
            </div>
            
            <div className="mt-10 p-4 bg-[#1a1a1a] rounded-lg border border-navmax-accent/30 flex items-start max-w-3xl">
              <AlertCircle size={20} className="text-navmax-accent mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-navmax-accent mb-1">{translate("incognito.warningTitle")}</h4>
                <p className="text-sm text-purple-300/80">
                  {translate("incognito.warningDescription")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Status Bar with Incognito Indicator */}
      <div className="flex justify-between items-center p-2 border-t border-purple-900/30 bg-[#1a1a1a] text-xs">
        <div className="ml-2 flex items-center text-purple-300/80">
          <EyeOff size={12} className="mr-2" />
          {translate("incognito.statusBar")}
        </div>
        <div className="mr-2 text-purple-300/50">
          NAVMAX
        </div>
      </div>
    </div>
  );
};

export default IncognitoPage;
