
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { useLanguage } from "@/language/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function LanguageButton() {
  const { currentLanguage, languageInfo, translate } = useLanguage();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleOpenLanguageSettings = () => {
    setOpen(false);
    navigate("/language-settings");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="hover:bg-navmax-accent/20 hover:text-navmax-accent"
        >
          <div className="flex items-center gap-2">
            <Globe size={18} />
            <span className="hidden sm:inline">{languageInfo.flag}</span>
          </div>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-72 bg-navmax-muted border-navmax-light">
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-navmax-foreground">
              {translate('languageSettings.currentLanguage')}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xl">{languageInfo.flag}</span>
              <h3 className="font-bold text-navmax-foreground">{languageInfo.name}</h3>
            </div>
          </div>
          
          <Button 
            onClick={handleOpenLanguageSettings} 
            className="w-full bg-navmax-accent hover:bg-navmax-accent/80"
          >
            {translate('languageSettings.changeLanguage')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
