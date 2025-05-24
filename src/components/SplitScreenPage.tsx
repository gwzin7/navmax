
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grip, ArrowLeft, RefreshCw, Layout, Plus, Minus, Copy, ExternalLink, Home, MoveHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/language/LanguageContext";
import { toast } from "@/hooks/use-toast";
import AddressBar from "./AddressBar";
import BrowserContent from "./BrowserContent";

const SplitScreenPage = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  
  const [splitRatio, setSplitRatio] = useState(50); // percentage for left panel
  const [isDragging, setIsDragging] = useState(false);
  
  // Left panel state
  const [leftUrl, setLeftUrl] = useState("https://example.com");
  const [leftTitle, setLeftTitle] = useState("Example Domain");
  const [leftIsLoading, setLeftIsLoading] = useState(false);
  const [leftCanNavigate, setLeftCanNavigate] = useState({ back: false, forward: false });
  
  // Right panel state
  const [rightUrl, setRightUrl] = useState("https://navmax.example.com");
  const [rightTitle, setRightTitle] = useState("NAVMAX");
  const [rightIsLoading, setRightIsLoading] = useState(false);
  const [rightCanNavigate, setRightCanNavigate] = useState({ back: false, forward: false });
  
  // Track which panel is active
  const [activePanel, setActivePanel] = useState<'left' | 'right'>('left');

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const container = e.currentTarget as HTMLDivElement;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newRatio = (x / rect.width) * 100;
      
      // Limit the split ratio to be between 20% and 80%
      setSplitRatio(Math.min(Math.max(newRatio, 20), 80));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleLeftNavigate = (url: string, isValid: boolean) => {
    if (isValid) {
      setLeftUrl(url);
    }
  };

  const handleRightNavigate = (url: string, isValid: boolean) => {
    if (isValid) {
      setRightUrl(url);
    }
  };

  const handleResetSplit = () => {
    setSplitRatio(50);
    toast({
      title: "Divisão redefinida",
      description: "As janelas agora têm tamanhos iguais."
    });
  };

  const handleCopyToOther = () => {
    if (activePanel === 'left') {
      setRightUrl(leftUrl);
      toast({
        title: "URL copiada",
        description: "URL da janela esquerda copiada para a direita."
      });
    } else {
      setLeftUrl(rightUrl);
      toast({
        title: "URL copiada",
        description: "URL da janela direita copiada para a esquerda."
      });
    }
  };

  const handleHomeClick = (panel: 'left' | 'right') => {
    if (panel === 'left') {
      setLeftUrl("");
    } else {
      setRightUrl("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay">
      {/* Header */}
      <div className="flex items-center p-3 border-b border-navmax-light bg-navmax-dark">
        <Button 
          variant="ghost" 
          size="sm"
          className="mr-2"
          onClick={() => navigate(-1)}
          title="Voltar"
        >
          <ArrowLeft size={16} />
        </Button>
        
        <h1 className="text-lg font-bold mr-4">Tela Dividida</h1>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="mr-2"
          onClick={handleResetSplit}
          title={translate("splitScreen.resetSplit") || "Redefinir divisão"}
        >
          <Layout size={16} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={handleCopyToOther}
          title={translate("splitScreen.copyToOther") || "Copiar para a outra janela"}
        >
          <Copy size={16} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="mr-2"
          onClick={() => {
            window.open(activePanel === 'left' ? leftUrl : rightUrl, '_blank');
          }}
          title="Abrir em nova guia"
        >
          <ExternalLink size={16} />
        </Button>
        
        <div className="ml-auto flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            title="Diminuir janela esquerda"
            onClick={() => setSplitRatio(Math.max(splitRatio - 5, 20))}
          >
            <Minus size={16} />
          </Button>
          
          <div className="flex items-center bg-navmax-muted px-2 py-1 rounded-md">
            <MoveHorizontal size={14} className="text-navmax-foreground/50 mr-1" />
            <span className="text-xs font-medium">{Math.round(splitRatio)}%</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            title="Aumentar janela esquerda"
            onClick={() => setSplitRatio(Math.min(splitRatio + 5, 80))}
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
      
      <div 
        className="flex-1 flex relative"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Left Panel */}
        <div 
          className={`flex flex-col ${isDragging ? 'select-none' : ''}`}
          style={{ width: `${splitRatio}%` }}
          onClick={() => setActivePanel('left')}
        >
          <div className={`p-1 border-b border-navmax-light ${activePanel === 'left' ? 'bg-navmax-muted' : 'bg-navmax-dark'}`}>
            <div className="flex items-center mb-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={() => handleHomeClick('left')}
              >
                <Home size={14} />
              </Button>
              <div className="flex-1 mx-1">
                <p className="text-xs truncate text-navmax-foreground/70">
                  {leftUrl || "Página inicial"}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={() => setLeftIsLoading(true)}
              >
                <RefreshCw size={14} className={leftIsLoading ? "animate-spin" : ""} />
              </Button>
            </div>
            <AddressBar 
              onNavigate={handleLeftNavigate}
              onRefresh={() => setLeftIsLoading(true)}
              onHome={() => setLeftUrl("")}
              canGoBack={leftCanNavigate.back}
              canGoForward={leftCanNavigate.forward}
              onGoBack={() => console.log("Left: Go back")}
              onGoForward={() => console.log("Left: Go forward")}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <BrowserContent 
              url={leftUrl}
              isValidDomain={true}
              onTitleChange={setLeftTitle}
              onLoadingChange={setLeftIsLoading}
              onNavigationChange={(back, forward) => 
                setLeftCanNavigate({ back, forward })
              }
            />
          </div>
        </div>
        
        {/* Resizer Handle */}
        <div 
          className={`absolute cursor-col-resize w-4 top-0 bottom-0 bg-transparent z-10
            ${isDragging ? 'after:bg-navmax-accent' : 'after:bg-navmax-light hover:after:bg-navmax-accent'}
            after:absolute after:left-1/2 after:transform after:-translate-x-1/2
            after:w-0.5 after:top-0 after:bottom-0 after:transition-colors`}
          style={{ left: `calc(${splitRatio}% - 0.5rem)` }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Grip size={12} className={isDragging ? "text-navmax-accent" : "text-navmax-foreground/50"} />
          </div>
        </div>
        
        {/* Right Panel */}
        <div 
          className={`flex flex-col ${isDragging ? 'select-none' : ''}`}
          style={{ width: `${100 - splitRatio}%` }}
          onClick={() => setActivePanel('right')}
        >
          <div className={`p-1 border-b border-navmax-light ${activePanel === 'right' ? 'bg-navmax-muted' : 'bg-navmax-dark'}`}>
            <div className="flex items-center mb-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={() => handleHomeClick('right')}
              >
                <Home size={14} />
              </Button>
              <div className="flex-1 mx-1">
                <p className="text-xs truncate text-navmax-foreground/70">
                  {rightUrl || "Página inicial"}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={() => setRightIsLoading(true)}
              >
                <RefreshCw size={14} className={rightIsLoading ? "animate-spin" : ""} />
              </Button>
            </div>
            <AddressBar 
              onNavigate={handleRightNavigate}
              onRefresh={() => setRightIsLoading(true)}
              onHome={() => setRightUrl("")}
              canGoBack={rightCanNavigate.back}
              canGoForward={rightCanNavigate.forward}
              onGoBack={() => console.log("Right: Go back")}
              onGoForward={() => console.log("Right: Go forward")}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <BrowserContent 
              url={rightUrl}
              isValidDomain={true}
              onTitleChange={setRightTitle}
              onLoadingChange={setRightIsLoading}
              onNavigationChange={(back, forward) => 
                setRightCanNavigate({ back, forward })
              }
            />
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="flex justify-between items-center p-1 border-t border-navmax-light bg-navmax-dark text-xs">
        <div className="ml-2 text-navmax-foreground/70">
          {activePanel === 'left' ? leftTitle : rightTitle}
        </div>
        <div className="mr-2 text-navmax-foreground/50">
          NAVMAX
        </div>
      </div>
    </div>
  );
};

export default SplitScreenPage;
