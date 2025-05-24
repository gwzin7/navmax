
import React, { useState } from "react";
import { Package, Shield, MoonStar, Type, Globe, Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/language/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface Extension {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  installed: boolean;
  active: boolean;
  rating: number;
  version: string;
  category: string;
}

const ExtensionsPage = () => {
  const { translate } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [extensions, setExtensions] = useState<Extension[]>([
    {
      id: "1",
      name: "NAVMAX Ad Blocker",
      description: "Block advertisements and popups while browsing",
      icon: <Shield className="h-6 w-6 text-navmax-accent" />,
      installed: true,
      active: true,
      rating: 4.8,
      version: "1.2.0",
      category: "Security"
    },
    {
      id: "2",
      name: "Dark Mode",
      description: "Force dark mode on all websites",
      icon: <MoonStar className="h-6 w-6 text-navmax-accent" />,
      installed: true,
      active: false,
      rating: 4.5,
      version: "2.0.1",
      category: "Appearance"
    },
    {
      id: "3",
      name: "Reader Mode",
      description: "Clean distraction-free reading experience",
      icon: <Type className="h-6 w-6 text-navmax-accent" />,
      installed: false,
      active: false,
      rating: 4.2,
      version: "1.1.3",
      category: "Reading"
    },
    {
      id: "4",
      name: "NAVMAX Translator",
      description: "Translate web pages into 40+ languages",
      icon: <Globe className="h-6 w-6 text-navmax-accent" />,
      installed: false,
      active: false,
      rating: 4.6,
      version: "1.3.7",
      category: "Language"
    }
  ]);

  const toggleInstall = (id: string) => {
    setExtensions(extensions.map(ext => {
      if (ext.id === id) {
        const installed = !ext.installed;
        return {
          ...ext,
          installed,
          active: installed ? ext.active : false
        };
      }
      return ext;
    }));
  };

  const toggleActive = (id: string) => {
    setExtensions(extensions.map(ext => {
      if (ext.id === id) {
        return { ...ext, active: !ext.active };
      }
      return ext;
    }));
  };

  const filteredExtensions = extensions.filter(ext =>
    ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ext.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ext.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay p-6">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold mr-auto">{translate("extensions.title")}</h1>
        <div className="relative w-64">
          <Input
            placeholder={translate("extensions.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-8"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {["All", "Security", "Appearance", "Reading", "Language"].map(category => (
          <Button 
            key={category}
            variant={category === "All" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSearchQuery(category === "All" ? "" : category)}
          >
            {category}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
        {filteredExtensions.map(ext => (
          <div key={ext.id} className="bg-navmax-muted rounded-xl p-5 border border-navmax-light flex flex-col">
            <div className="flex items-start mb-4">
              <div className="p-2 rounded-lg bg-navmax-dark mr-3">
                {ext.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{ext.name}</h3>
                <p className="text-sm text-navmax-foreground/70">{ext.description}</p>
              </div>
            </div>
            
            <div className="mt-auto pt-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{ext.version}</Badge>
                <div className="flex items-center">
                  <span className="text-xs text-navmax-foreground/70 mr-1">★</span>
                  <span className="text-xs">{ext.rating}</span>
                </div>
              </div>
              
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex space-x-2">
                    {ext.installed && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleActive(ext.id)}
                        className={ext.active ? "bg-navmax-accent/20 text-navmax-accent" : ""}
                      >
                        {ext.active ? <Check size={14} className="mr-1" /> : null}
                        {ext.active ? translate("extensions.active") : translate("extensions.inactive")}
                      </Button>
                    )}
                    <Button 
                      variant={ext.installed ? "ghost" : "default"}
                      size="sm"
                      onClick={() => toggleInstall(ext.id)}
                    >
                      {ext.installed ? <X size={14} className="mr-1" /> : <Upload size={14} className="mr-1" />}
                      {ext.installed ? translate("extensions.remove") : translate("extensions.install")}
                    </Button>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-2">
                  {ext.installed 
                    ? translate("extensions.removeHint") 
                    : translate("extensions.installHint")}
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-xs text-navmax-foreground/50 absolute right-6 bottom-6">
        NAVMAX
      </div>
    </div>
  );
};

export default ExtensionsPage;
