
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/language/LanguageContext";
import { 
  ArrowLeft,
  Clock, 
  Search,
  Trash2,
  X
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter
} from "./ui/card";
import { motion } from "framer-motion";

// Mock history data
const mockHistoryData = [
  { 
    id: 1, 
    title: "Google - Search Engine", 
    url: "https://google.com", 
    favicon: "https://www.google.com/favicon.ico", 
    timestamp: new Date(2025, 4, 22, 14, 30),
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234285F4' width='24' height='24'%3E%3Cpath d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='%2334A853'/%3E%3Cpath d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='%23FBBC05'/%3E%3Cpath d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='%23EA4335'/%3E%3Cpath d='M1 1h22v22H1z' fill='none'/%3E%3C/svg%3E",
  },
  { 
    id: 2, 
    title: "YouTube - Video Sharing", 
    url: "https://youtube.com", 
    favicon: "https://www.youtube.com/favicon.ico", 
    timestamp: new Date(2025, 4, 22, 12, 15),
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF0000' width='24' height='24'%3E%3Cpath d='M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .526 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z'/%3E%3C/svg%3E",
  },
  { 
    id: 3, 
    title: "Amazon - Online Shopping", 
    url: "https://amazon.com", 
    favicon: "https://www.amazon.com/favicon.ico", 
    timestamp: new Date(2025, 4, 21, 18, 45),
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF9900' width='24' height='24'%3E%3Cpath d='M18.964 12.383c-2.17-.11-5.023.07-7.126 1.78-2.283 1.88-1.883 4.5-.88 5.437.92.87 2.263 1.26 3.867.76 1.74-.54 2.868-1.81 2.74-3.47-.1-1.35-1.27-1.8-2.28-1.67-.83.12-1.23.69-1.12 1.26.08.39.37.72.78.66.36-.05.35-.52-.03-.78-.14-.1-.05-.37.2-.45.84-.28 2.42.2 2 1.8-.36 1.36-1.45 2-2.87 2.12-1.7.12-3.22-.86-3.05-2.8.15-1.67 1.33-3.06 2.55-3.77 2.55-1.51 6.84-1.22 8.24 1.1.16.25.26.55.36.84.6.16.21.15.26-.03.24-.75 0-2.14-1.32-2.76-.85-.4-1.6-.6-2.32-.57zM15.41 15.12h.31c.76.03 1.15-.64 1.1-1.17-.06-.53-.6-.86-1.02-.86-.36 0-.97.27-.93.82.04.45.3.66.54 1.2z'/%3E%3Cpath d='M14.19 17.77c-1.99 1.98-4.8 3.05-7.8 3.05C2.87 20.82 0 17.96 0 14.44c0-3.52 2.87-6.38 6.39-6.38 3.52 0 6.39 2.87 6.39 6.38 0 .81-.16 1.59-.43 2.3M10.8 14.44c0-2.44-1.97-4.42-4.41-4.42-2.44 0-4.41 1.98-4.41 4.42 0 2.44 1.97 4.42 4.41 4.42 2.44 0 4.41-1.98 4.41-4.42'/%3E%3C/svg%3E",
  },
  { 
    id: 4, 
    title: "Wikipedia - The Free Encyclopedia", 
    url: "https://wikipedia.org", 
    favicon: "https://www.wikipedia.org/favicon.ico", 
    timestamp: new Date(2025, 4, 21, 16, 22),
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath d='M12.092 11.118l-.254.619c-.484 1.122-.903 2.131-1.243 3.327-.338-1.196-.816-2.205-1.243-3.327l-.254-.619h2.994zm1.551-3.871h4.917L24 19.764h-4.332l-.483-1.614h-3.94l-.483 1.614h-4.332l5.213-12.517zm-7.301 0l-1.287 8.53L3.59 7.247H.531L0 10.685h1.883l.169-1.14 2.332 6.809h2.567l2.397-6.809.169 1.14h1.883L11 7.247H7.795l-1.453 8.53L5.149 9.023c-.169-.981-.507-1.359-1.694-1.359H.998L0 11.881h1.202c.338 0 .507-.17.592-.508l.535-3.756zM16.03 12.051l-.742 2.481h1.498l-.756-2.481z' fill='%23000000'/%3E%3C/svg%3E",
  },
  { 
    id: 5, 
    title: "Twitter - Social Media", 
    url: "https://twitter.com", 
    favicon: "https://www.twitter.com/favicon.ico", 
    timestamp: new Date(2025, 4, 21, 10, 5),
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231DA1F2' width='24' height='24'%3E%3Cpath d='M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z'/%3E%3C/svg%3E",
  }
];

const HistoryPage = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [historyItems, setHistoryItems] = useState(mockHistoryData);
  
  // Filter history based on search term
  const filteredHistory = historyItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.url.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Format date for display
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Delete a history item
  const deleteHistoryItem = (id: number) => {
    setHistoryItems(historyItems.filter(item => item.id !== id));
  };
  
  // Clear all history
  const clearAllHistory = () => {
    setHistoryItems([]);
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
        <h1 className="text-xl font-bold">{translate('history.title') || "History"}</h1>
        
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
            onClick={clearAllHistory}
          >
            <Trash2 size={18} className="mr-2" />
            <span>{translate('history.clearAll') || "Clear All"}</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-navmax">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="search"
            placeholder={translate('history.searchPlaceholder') || "Search history..."}
            className="pl-10 browser-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8" 
              onClick={() => setSearchTerm("")}
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* History Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay">
        {filteredHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden h-full border-navmax-light hover:border-navmax-accent/50 transition-all duration-200">
                  <div className="relative h-32 bg-navmax-muted">
                    {/* This would be a real screenshot in a real browser */}
                    <div className="flex items-center justify-center h-full bg-navmax-muted">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="h-16 w-16 opacity-50"
                      />
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 bg-black/50 hover:bg-red-900/50"
                      onClick={() => deleteHistoryItem(item.id)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <img 
                        src={item.favicon} 
                        alt="" 
                        className="h-4 w-4"
                        onError={(e) => {
                          // Replace with generic icon if favicon fails to load
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999999' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E";
                        }}
                      />
                      <h3 className="font-bold text-sm truncate">{item.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 truncate">{item.url}</p>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>{formatDate(item.timestamp)}</span>
                      <span>-</span>
                      <span>{formatTime(item.timestamp)}</span>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Clock className="h-16 w-16 text-navmax-light mb-4" />
            <h3 className="text-xl font-bold mb-2">{translate('history.noResults') || "No History Found"}</h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? translate('history.noResultsForSearch') || "No results match your search" 
                : translate('history.emptyHistory') || "Your browsing history will appear here"}
            </p>
          </div>
        )}
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

export default HistoryPage;
