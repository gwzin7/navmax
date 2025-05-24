
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/language/LanguageContext";
import { 
  ArrowLeft, 
  Globe,
  Moon,
  Sun,
  User,
  ChevronRight,
  Shield,
  Bookmark,
  Clock,
  Trash2,
  Bell,
  Download
} from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "sonner";

type ThemeOption = "dark" | "light" | "system";

const SettingsPage = () => {
  const { translate, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Mock settings
  const [theme, setTheme] = useState<ThemeOption>("dark");
  const [notifications, setNotifications] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [blockTrackers, setBlockTrackers] = useState(true);
  
  const handleThemeChange = (newTheme: ThemeOption) => {
    setTheme(newTheme);
    toast.success(`${translate('settings.themeChanged') || "Theme changed to"} ${translate(`settings.${newTheme}`) || newTheme}`);
    
    // In a real app, we'd apply the theme to the app
    // document.documentElement.classList.remove('light', 'dark');
    // if (newTheme !== 'system') {
    //   document.documentElement.classList.add(newTheme);
    // }
  };
  
  const clearBrowsingData = () => {
    // In a real app, we'd clear browsing data here
    toast.success(translate('settings.browsingDataCleared') || "Browsing data cleared");
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-navmax-muted border-b border-navmax-light p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="nav-button mr-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold">{translate('settings.title') || "Settings"}</h1>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* User Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold">{translate('settings.account') || "Account"}</h2>
            
            <div className="bg-navmax-muted rounded-xl overflow-hidden border border-navmax-light">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-navmax-accent flex items-center justify-center">
                    <User size={20} />
                  </div>
                  
                  <div>
                    <h3 className="font-medium">
                      {user ? user.name : translate('settings.notLoggedIn') || "Not logged in"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {user ? user.email : translate('settings.loginToSync') || "Login to sync your data"}
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/")}
                  className="text-navmax-accent hover:bg-navmax-accent/10"
                >
                  {user 
                    ? translate('settings.manage') || "Manage" 
                    : translate('common.login') || "Login"}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Appearance Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold">{translate('settings.appearance') || "Appearance"}</h2>
            
            <div className="bg-navmax-muted rounded-xl overflow-hidden border border-navmax-light">
              {/* Theme Option */}
              <div className="p-4">
                <h3 className="font-medium mb-4">{translate('settings.theme') || "Theme"}</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <Button 
                    variant={theme === "light" ? "default" : "outline"}
                    className={theme === "light" 
                      ? "bg-navmax-accent hover:bg-navmax-accent/80" 
                      : "border-navmax-light"
                    }
                    onClick={() => handleThemeChange("light")}
                  >
                    <Sun size={16} className="mr-2" />
                    {translate('settings.light') || "Light"}
                  </Button>
                  
                  <Button 
                    variant={theme === "dark" ? "default" : "outline"}
                    className={theme === "dark" 
                      ? "bg-navmax-accent hover:bg-navmax-accent/80" 
                      : "border-navmax-light"
                    }
                    onClick={() => handleThemeChange("dark")}
                  >
                    <Moon size={16} className="mr-2" />
                    {translate('settings.dark') || "Dark"}
                  </Button>
                  
                  <Button 
                    variant={theme === "system" ? "default" : "outline"}
                    className={theme === "system" 
                      ? "bg-navmax-accent hover:bg-navmax-accent/80" 
                      : "border-navmax-light"
                    }
                    onClick={() => handleThemeChange("system")}
                  >
                    {translate('settings.system') || "System"}
                  </Button>
                </div>
              </div>
              
              {/* Language Option */}
              <div className="p-4 border-t border-navmax-light">
                <button
                  className="w-full flex items-center justify-between py-2 hover:text-navmax-accent transition-colors duration-200"
                  onClick={() => navigate("/language-settings")}
                >
                  <div className="flex items-center gap-3">
                    <Globe size={18} />
                    <div className="text-left">
                      <h3 className="font-medium">{translate('settings.language') || "Language"}</h3>
                      <p className="text-xs text-muted-foreground">
                        {currentLanguage === "en-US" ? "English" : 
                         currentLanguage === "pt-BR" ? "Português" :
                         currentLanguage === "es-ES" ? "Español" :
                         currentLanguage === "fr-FR" ? "Français" :
                         currentLanguage === "de-DE" ? "Deutsch" : "English"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Privacy & Security Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold">{translate('settings.privacySecurity') || "Privacy & Security"}</h2>
            
            <div className="bg-navmax-muted rounded-xl overflow-hidden border border-navmax-light">
              {/* Block Trackers */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-navmax-accent" />
                  <div>
                    <h3 className="font-medium">{translate('settings.blockTrackers') || "Block Trackers"}</h3>
                    <p className="text-xs text-muted-foreground">{translate('settings.blockTrackersDesc') || "Block third-party trackers"}</p>
                  </div>
                </div>
                <Switch
                  checked={blockTrackers}
                  onCheckedChange={setBlockTrackers}
                  className="data-[state=checked]:bg-navmax-accent"
                />
              </div>
              
              {/* Notifications */}
              <div className="px-4 py-3 border-t border-navmax-light flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-navmax-accent" />
                  <div>
                    <h3 className="font-medium">{translate('settings.notifications') || "Notifications"}</h3>
                    <p className="text-xs text-muted-foreground">{translate('settings.notificationsDesc') || "Allow browser notifications"}</p>
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  className="data-[state=checked]:bg-navmax-accent"
                />
              </div>
              
              {/* Auto Updates */}
              <div className="px-4 py-3 border-t border-navmax-light flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download size={18} className="text-navmax-accent" />
                  <div>
                    <h3 className="font-medium">{translate('settings.autoUpdate') || "Auto Update"}</h3>
                    <p className="text-xs text-muted-foreground">{translate('settings.autoUpdateDesc') || "Keep browser up to date"}</p>
                  </div>
                </div>
                <Switch
                  checked={autoUpdate}
                  onCheckedChange={setAutoUpdate}
                  className="data-[state=checked]:bg-navmax-accent"
                />
              </div>
            </div>
          </div>
          
          {/* Data Management Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold">{translate('settings.dataManagement') || "Data Management"}</h2>
            
            <div className="bg-navmax-muted rounded-xl overflow-hidden border border-navmax-light">
              {/* Bookmarks */}
              <button
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-navmax/50 transition-colors duration-200"
                onClick={() => navigate("/bookmarks")}
              >
                <div className="flex items-center gap-3">
                  <Bookmark size={18} className="text-navmax-accent" />
                  <h3 className="font-medium">{translate('bookmarks.title') || "Bookmarks"}</h3>
                </div>
                <ChevronRight size={16} />
              </button>
              
              {/* History */}
              <button
                className="w-full px-4 py-3 border-t border-navmax-light flex items-center justify-between hover:bg-navmax/50 transition-colors duration-200"
                onClick={() => navigate("/history")}
              >
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-navmax-accent" />
                  <h3 className="font-medium">{translate('history.title') || "History"}</h3>
                </div>
                <ChevronRight size={16} />
              </button>
              
              {/* Clear Browsing Data */}
              <button
                className="w-full px-4 py-3 border-t border-navmax-light flex items-center justify-between hover:bg-navmax/50 transition-colors duration-200"
                onClick={clearBrowsingData}
              >
                <div className="flex items-center gap-3">
                  <Trash2 size={18} className="text-red-500" />
                  <h3 className="font-medium">{translate('settings.clearData') || "Clear Browsing Data"}</h3>
                </div>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          {/* About Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold">{translate('settings.about') || "About"}</h2>
            
            <div className="bg-navmax-muted rounded-xl overflow-hidden border border-navmax-light p-4">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold">
                    <span className="text-navmax-accent">NAV</span>
                    <span>MAX</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">Version 1.0.0-alpha</p>
                </div>
                
                <p className="text-center text-sm max-w-md">
                  {translate('settings.aboutDesc') || "A modern, secure browser focused on privacy and performance. Developed by agênciaMAX."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-navmax border-t border-navmax-light flex justify-end items-center">
        <div className="text-xs text-muted-foreground">
          <span>{translate('languageSettings.powered') || "Powered by"} </span>
          <span className="font-bold">agênciaMAX</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
