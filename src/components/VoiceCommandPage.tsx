
import React, { useState, useEffect } from "react";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/language/LanguageContext";

const VoiceCommandPage = () => {
  const { translate } = useLanguage();
  const [listening, setListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [suggestions] = useState([
    "Open YouTube",
    "Search for digital marketing",
    "Go to settings",
    "Show downloads",
    "Open new tab"
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (listening) {
      // Simulate voice recognition
      timer = setTimeout(() => {
        setTranscription("Opening YouTube...");
        
        setTimeout(() => {
          setListening(false);
          // In a real implementation, this would navigate to YouTube
          console.log("Voice command executed: Opening YouTube");
        }, 1500);
      }, 2000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [listening]);

  const toggleListening = () => {
    setListening(!listening);
    setPulseAnimation(!listening);
    setTranscription("");
    
    if (!listening) {
      // Start animation
      setPulseAnimation(true);
    } else {
      // Stop animation
      setPulseAnimation(false);
    }
  };

  const executeCommand = (command: string) => {
    setTranscription(`Executing: ${command}...`);
    
    // In a real app, this would actually execute the command
    setTimeout(() => {
      console.log(`Voice command executed: ${command}`);
      setTranscription("");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay p-6">
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-3xl font-bold mb-12">{translate("voice.title")}</h1>
        
        <div className="relative flex flex-col items-center">
          <Button
            onClick={toggleListening}
            variant="ghost"
            className={`rounded-full h-40 w-40 flex items-center justify-center transition-all
              ${listening ? 'bg-navmax-accent bg-opacity-20' : 'bg-navmax-muted hover:bg-navmax-accent hover:bg-opacity-10'}`}
          >
            {listening ? (
              <div className="relative">
                <Mic size={64} className="text-navmax-accent animate-pulse" />
                {pulseAnimation && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-navmax-accent opacity-20 animate-ping" />
                    <div className="absolute -inset-4 rounded-full border border-navmax-accent opacity-10 animate-ping" style={{ animationDelay: '0.2s' }} />
                    <div className="absolute -inset-8 rounded-full border border-navmax-accent opacity-5 animate-ping" style={{ animationDelay: '0.4s' }} />
                  </>
                )}
              </div>
            ) : (
              <MicOff size={64} className="text-navmax-foreground/70" />
            )}
          </Button>
          
          <div className="h-8 mt-8 text-center">
            {transcription && (
              <p className="text-lg text-navmax-accent animate-fade-in">{transcription}</p>
            )}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold mb-4">{translate("voice.suggestions")}</h3>
          <div className="flex flex-wrap gap-3 justify-center max-w-lg">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="border-navmax-light hover:border-navmax-accent"
                onClick={() => executeCommand(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-center p-4 bg-navmax-muted rounded-xl">
        <AlertCircle size={16} className="text-navmax-foreground/70 mr-2" />
        <p className="text-sm text-navmax-foreground/70">
          {translate("voice.permissionNotice")}
        </p>
      </div>
      
      <div className="mt-6 text-xs text-navmax-foreground/50 absolute right-6 bottom-6">
        NAVMAX
      </div>
    </div>
  );
};

export default VoiceCommandPage;
