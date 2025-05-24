
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage, languages, Language } from "@/language/LanguageContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const LanguageSettings = () => {
  const { currentLanguage, setLanguage, translate } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    toast({
      title: translate('languageSettings.languageChanged'),
      description: languages.find(lang => lang.code === language)?.name,
      duration: 2000,
    });
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
        <h1 className="text-xl font-bold">{translate('languageSettings.title')}</h1>
      </div>

      {/* Content */}
      <div 
        className="flex-1 overflow-y-auto p-6 bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {translate('languageSettings.selectLanguage')}
          </h2>
          
          <div className="grid gap-4">
            {languages.map((language) => (
              <div 
                key={language.code}
                className={`
                  p-4 rounded-xl border transition-all duration-200
                  ${currentLanguage === language.code 
                    ? 'border-navmax-accent bg-navmax-accent/10' 
                    : 'border-navmax-light hover:bg-navmax-muted'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{language.flag}</span>
                    <div>
                      <h3 className="font-bold text-lg">{language.name}</h3>
                      <p className="text-sm text-muted-foreground">{language.country}</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleLanguageSelect(language.code)}
                    variant={currentLanguage === language.code ? "default" : "outline"}
                    className={currentLanguage === language.code 
                      ? "bg-navmax-accent hover:bg-navmax-accent/80" 
                      : ""
                    }
                  >
                    {currentLanguage === language.code 
                      ? translate('common.select') + 'ed' 
                      : translate('common.select')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-navmax border-t border-navmax-light flex justify-end items-center">
        <div className="text-xs text-muted-foreground">
          <span>{translate('languageSettings.powered')} </span>
          <span className="font-bold">agênciaMAX</span>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;
