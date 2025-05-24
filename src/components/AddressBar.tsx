
import { useState, FormEvent, useRef } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  Home, 
  Search,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/auth/AuthContext";
import { isUrlWhitelisted, getFormattedUrl, logNavigation } from "@/security/whitelistSystem";

interface AddressBarProps {
  onNavigate: (url: string, isValid: boolean) => void;
  onRefresh: () => void;
  onHome: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
}

export default function AddressBar({
  onNavigate,
  onRefresh,
  onHome,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward
}: AddressBarProps) {
  const [url, setUrl] = useState("");
  const { user, isAuthenticated } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const formattedUrl = getFormattedUrl(url);
    const isValid = isUrlWhitelisted(formattedUrl);
    
    // Log navigation attempt
    logNavigation(formattedUrl, user?.name || null);
    
    // Navigate to URL or show error
    onNavigate(formattedUrl, isValid);
  };

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  return (
    <div className="flex items-center gap-1 px-2 py-1">
      <div className="flex items-center gap-1">
        <Button 
          onClick={onGoBack} 
          disabled={!canGoBack}
          variant="ghost" 
          size="icon" 
          className="nav-button"
          title="Go back"
        >
          <ArrowLeft size={18} />
        </Button>
        
        <Button 
          onClick={onGoForward} 
          disabled={!canGoForward}
          variant="ghost" 
          size="icon" 
          className="nav-button"
          title="Go forward"
        >
          <ArrowRight size={18} />
        </Button>
        
        <Button 
          onClick={onRefresh} 
          variant="ghost" 
          size="icon" 
          className="nav-button"
          title="Refresh"
        >
          <RefreshCw size={18} />
        </Button>
        
        <Button 
          onClick={onHome} 
          variant="ghost" 
          size="icon" 
          className="nav-button"
          title="Home"
        >
          <Home size={18} />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1 flex items-center">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            {!isUrlWhitelisted(url) && url ? (
              <AlertTriangle size={16} className="text-navmax-accent" />
            ) : (
              <Search size={16} className="text-muted-foreground" />
            )}
          </div>
          
          <Input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL or search term"
            className="browser-input pl-8"
            onFocus={handleFocus}
          />
        </div>
      </form>
    </div>
  );
}
