
import React, { useState } from "react";
import { Shield, Eye, EyeOff, Lock, Unlock, Trash2, Database, Camera, Mic, MapPin, Bell, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/language/LanguageContext";

interface PrivacyOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
}

interface PermissionSite {
  id: string;
  domain: string;
  camera: boolean;
  microphone: boolean;
  location: boolean;
  notifications: boolean;
}

const PrivacySecurityPage = () => {
  const { translate } = useLanguage();
  const [privacyLevel, setPrivacyLevel] = useState(60);
  const [privacyOptions, setPrivacyOptions] = useState<PrivacyOption[]>([
    {
      id: "trackers",
      name: translate("privacy.blockTrackers"),
      description: translate("privacy.trackersDescription"),
      enabled: true,
      icon: <Shield className="h-5 w-5 text-navmax-accent" />
    },
    {
      id: "cookies",
      name: translate("privacy.blockCookies"),
      description: translate("privacy.cookiesDescription"),
      enabled: false,
      icon: <Database className="h-5 w-5 text-navmax-accent" />
    },
    {
      id: "fingerprinting",
      name: translate("privacy.preventFingerprinting"),
      description: translate("privacy.fingerprintingDescription"),
      enabled: true,
      icon: <Eye className="h-5 w-5 text-navmax-accent" />
    },
    {
      id: "httpsOnly",
      name: translate("privacy.httpsOnly"),
      description: translate("privacy.httpsDescription"),
      enabled: false,
      icon: <Lock className="h-5 w-5 text-navmax-accent" />
    }
  ]);
  
  const [permissionSites, setPermissionSites] = useState<PermissionSite[]>([
    {
      id: "1",
      domain: "meet.google.com",
      camera: true,
      microphone: true,
      location: false,
      notifications: true
    },
    {
      id: "2",
      domain: "maps.google.com",
      camera: false,
      microphone: false,
      location: true,
      notifications: false
    },
    {
      id: "3",
      domain: "youtube.com",
      camera: false,
      microphone: false,
      location: false,
      notifications: true
    }
  ]);

  const togglePrivacyOption = (id: string) => {
    setPrivacyOptions(privacyOptions.map(option => {
      if (option.id === id) {
        return { ...option, enabled: !option.enabled };
      }
      return option;
    }));
    
    // Recalculate privacy score whenever settings change
    const enabledCount = privacyOptions.filter(opt => opt.id !== id ? opt.enabled : !opt.enabled).length;
    const newScore = Math.round((enabledCount / privacyOptions.length) * 100);
    setPrivacyLevel(newScore);
  };

  const togglePermission = (siteId: string, permission: keyof PermissionSite) => {
    setPermissionSites(permissionSites.map(site => {
      if (site.id === siteId && typeof site[permission] === 'boolean') {
        return { ...site, [permission]: !site[permission] };
      }
      return site;
    }));
  };

  const removeSite = (id: string) => {
    setPermissionSites(permissionSites.filter(site => site.id !== id));
  };

  const clearAllSiteData = () => {
    // In a real app, this would clear site data
    console.log("Clearing all site data");
    // Show a toast notification
  };

  return (
    <div className="flex flex-col h-screen bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay p-6">
      <h1 className="text-3xl font-bold mb-8">{translate("privacy.title")}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Privacy Options */}
          <div className="bg-navmax-muted rounded-xl p-6 border border-navmax-light">
            <h2 className="text-xl font-semibold mb-4">{translate("privacy.privacyOptions")}</h2>
            <div className="space-y-6">
              {privacyOptions.map(option => (
                <div key={option.id} className="flex items-start">
                  <div className="p-2 rounded-lg bg-navmax-dark mr-3 mt-0.5">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={option.id} className="font-semibold">{option.name}</Label>
                      <Switch 
                        id={option.id}
                        checked={option.enabled}
                        onCheckedChange={() => togglePrivacyOption(option.id)}
                      />
                    </div>
                    <p className="text-sm text-navmax-foreground/70 mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Site Permissions */}
          <div className="bg-navmax-muted rounded-xl p-6 border border-navmax-light">
            <h2 className="text-xl font-semibold mb-4">{translate("privacy.sitePermissions")}</h2>
            
            {permissionSites.length > 0 ? (
              <div className="space-y-4">
                {permissionSites.map(site => (
                  <div key={site.id} className="p-4 rounded-lg bg-navmax border border-navmax-light">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{site.domain}</h3>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-7 w-7 text-navmax-accent hover:bg-navmax-accent/20"
                        onClick={() => removeSite(site.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Camera size={14} className="mr-2" />
                          <Label htmlFor={`${site.id}-camera`} className="text-sm">
                            {translate("privacy.camera")}
                          </Label>
                        </div>
                        <Switch 
                          id={`${site.id}-camera`}
                          checked={site.camera}
                          onCheckedChange={() => togglePermission(site.id, 'camera')}
                          className="scale-75"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Mic size={14} className="mr-2" />
                          <Label htmlFor={`${site.id}-microphone`} className="text-sm">
                            {translate("privacy.microphone")}
                          </Label>
                        </div>
                        <Switch 
                          id={`${site.id}-microphone`}
                          checked={site.microphone}
                          onCheckedChange={() => togglePermission(site.id, 'microphone')}
                          className="scale-75"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-2" />
                          <Label htmlFor={`${site.id}-location`} className="text-sm">
                            {translate("privacy.location")}
                          </Label>
                        </div>
                        <Switch 
                          id={`${site.id}-location`}
                          checked={site.location}
                          onCheckedChange={() => togglePermission(site.id, 'location')}
                          className="scale-75"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Bell size={14} className="mr-2" />
                          <Label htmlFor={`${site.id}-notifications`} className="text-sm">
                            {translate("privacy.notifications")}
                          </Label>
                        </div>
                        <Switch 
                          id={`${site.id}-notifications`}
                          checked={site.notifications}
                          onCheckedChange={() => togglePermission(site.id, 'notifications')}
                          className="scale-75"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-navmax-foreground/50">
                <p>{translate("privacy.noSitePermissions")}</p>
              </div>
            )}
          </div>
          
          {/* Clear Browsing Data */}
          <div className="bg-navmax-muted rounded-xl p-6 border border-navmax-light">
            <h2 className="text-xl font-semibold mb-4">{translate("privacy.clearBrowsingData")}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <Database size={16} className="mr-2" />
                {translate("privacy.clearCookies")}
              </Button>
              <Button variant="outline" className="w-full">
                <Trash2 size={16} className="mr-2" />
                {translate("privacy.clearCache")}
              </Button>
              <Button variant="outline" className="w-full">
                <Clock size={16} className="mr-2" />
                {translate("privacy.clearHistory")}
              </Button>
              <Button 
                variant="default" 
                className="w-full bg-navmax-accent hover:bg-navmax-accent/90"
                onClick={clearAllSiteData}
              >
                <Trash2 size={16} className="mr-2" />
                {translate("privacy.clearAllData")}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Privacy Score */}
        <div className="space-y-8">
          <div className="bg-navmax-muted rounded-xl p-6 border border-navmax-light flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-6">{translate("privacy.privacyScore")}</h2>
            
            <div className="relative w-48 h-48 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="#333"
                  strokeWidth="16"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke={privacyLevel > 70 ? "#4caf50" : privacyLevel > 40 ? "#ff9800" : "#ea384c"}
                  strokeWidth="16"
                  strokeDasharray="552.9"
                  strokeDashoffset={552.9 - (privacyLevel / 100) * 552.9}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{privacyLevel}</span>
                <span className="text-sm text-navmax-foreground/70">{translate("privacy.outOf100")}</span>
              </div>
            </div>
            
            <div>
              {privacyLevel > 70 ? (
                <p className="text-center text-green-400">{translate("privacy.scoreExcellent")}</p>
              ) : privacyLevel > 40 ? (
                <p className="text-center text-yellow-500">{translate("privacy.scoreModerate")}</p>
              ) : (
                <p className="text-center text-navmax-accent">{translate("privacy.scorePoor")}</p>
              )}
            </div>
          </div>
          
          <div className="bg-navmax-muted rounded-xl p-6 border border-navmax-light">
            <h2 className="text-xl font-semibold mb-4">{translate("privacy.incognitoMode")}</h2>
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-navmax-dark mr-3">
                <EyeOff className="h-5 w-5 text-navmax-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="incognito-mode" className="font-semibold">
                    {translate("privacy.enableIncognito")}
                  </Label>
                  <Switch 
                    id="incognito-mode"
                    // In a real app, this would toggle incognito mode
                  />
                </div>
              </div>
            </div>
            <p className="text-sm text-navmax-foreground/70 mt-2">
              {translate("privacy.incognitoDescription")}
            </p>
            <Button className="w-full mt-4" variant="outline">
              <EyeOff size={16} className="mr-2" />
              {translate("privacy.newIncognitoWindow")}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-xs text-navmax-foreground/50 absolute right-6 bottom-6">
        NAVMAX
      </div>
    </div>
  );
};

export default PrivacySecurityPage;
