
import React, { useState, useRef, useEffect } from "react";
import { Search, Mic, ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/language/LanguageContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface SearchBarProps {
  onSearch?: (searchQuery?: string) => void;
  showToggle?: boolean;
}

const SearchBar = ({ onSearch, showToggle = false }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [useNavmaxSearch, setUseNavmaxSearch] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [showEngineConfirm, setShowEngineConfirm] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState<'navmax' | 'google'>('navmax');
  const { translate } = useLanguage();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Web Speech API setup
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize Web Speech API if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      
      if (recognition.current) {
        recognition.current.continuous = false;
        recognition.current.interimResults = false;
        recognition.current.lang = 'pt-BR'; // Default language
        
        recognition.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
          setIsListening(false);
          
          toast({
            title: "Pesquisa por voz capturada",
            description: transcript
          });
          
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        };
        
        recognition.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          
          toast({
            title: "Erro na pesquisa por voz",
            description: "Não foi possível capturar áudio. Tente novamente.",
            variant: "destructive"
          });
        };
        
        recognition.current.onend = () => {
          setIsListening(false);
        };
      }
    }
    
    return () => {
      if (recognition.current) {
        recognition.current.abort();
      }
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }

    console.log(`Searching for: ${searchQuery} using ${useNavmaxSearch ? 'NavMAX' : 'Google'}`);
    
    if (onSearch) {
      if (useNavmaxSearch) {
        // Direct search to NavMAX
        const navmaxUrl = `https://www.intellinax.com.br/search?q=${encodeURIComponent(searchQuery)}`;
        window.open(navmaxUrl, '_blank');
      } else {
        // Direct search to Google
        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
        window.open(googleUrl, '_blank');
      }
      
      onSearch(searchQuery);
    }
  };

  const confirmSearchEngine = () => {
    setUseNavmaxSearch(selectedEngine === 'navmax');
    setShowEngineConfirm(false);
    
    toast({
      title: `Mecanismo de busca alterado para ${selectedEngine === 'navmax' ? 'NavMAX' : 'Google'}`,
      description: "Suas pesquisas agora usarão este mecanismo de busca."
    });
  };

  const startVoiceRecognition = () => {
    // Check if browser supports speech recognition
    if (recognition.current) {
      setIsListening(true);
      
      toast({
        title: "Escutando...",
        description: "Fale sua pesquisa"
      });
      
      try {
        recognition.current.start();
      } catch (error) {
        console.error('Speech recognition error', error);
        setIsListening(false);
        
        toast({
          title: "Erro ao iniciar microfone",
          description: "Tente novamente ou verifique as permissões do navegador.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Microfone não suportado",
        description: "Seu navegador não suporta pesquisa por voz.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <Input
          ref={searchInputRef}
          type="text"
          placeholder={useNavmaxSearch ? "Pesquisar com NavMAX..." : "Pesquisar com Google..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-24 h-14 text-lg bg-navmax-muted border-navmax-light rounded-xl focus:ring-navmax-accent"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
          {showToggle && (
            <DropdownMenu open={showEngineConfirm} onOpenChange={setShowEngineConfirm}>
              <DropdownMenuTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  className="h-9 px-2 text-xs font-medium flex items-center gap-1 hover:bg-navmax-accent/10"
                  id="search-engine-toggle"
                >
                  {useNavmaxSearch ? 'NavMAX' : 'Google'} <ChevronDown size={12} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2 bg-navmax-muted border-navmax-light">
                <div className="px-2 py-1.5 text-sm font-semibold">Mecanismo de busca</div>
                
                <DropdownMenuItem 
                  onClick={() => setSelectedEngine('navmax')}
                  className="cursor-pointer flex items-center justify-between"
                >
                  NavMAX
                  {selectedEngine === 'navmax' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => setSelectedEngine('google')}
                  className="cursor-pointer flex items-center justify-between"
                >
                  Google
                  {selectedEngine === 'google' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <div className="px-2 py-1.5 flex justify-end">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={confirmSearchEngine}
                    className="bg-navmax-accent hover:bg-navmax-accent/90 text-xs h-8"
                    id="confirm-search-engine"
                  >
                    Confirmar
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <Button 
            type="button"
            variant="ghost"
            size="sm"
            onClick={startVoiceRecognition}
            disabled={isListening}
            className={`h-9 w-9 p-0 rounded-full ${isListening ? 'bg-navmax-accent/20' : 'hover:bg-navmax-accent/10'}`}
            id="voice-search-button"
          >
            <Mic className={`h-4 w-4 ${isListening ? 'text-navmax-accent animate-pulse' : ''}`} />
            <span className="sr-only">Pesquisa por voz</span>
          </Button>
          
          <Button 
            type="submit" 
            size="sm" 
            className="h-9 bg-navmax-accent hover:bg-navmax-accent/90"
            id="search-submit"
          >
            Buscar
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
