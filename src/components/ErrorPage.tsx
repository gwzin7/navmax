
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLanguage } from "@/language/LanguageContext";

interface ErrorPageProps {
  url: string;
  onReturnHome: () => void;
}

export default function ErrorPage({ url, onReturnHome }: ErrorPageProps) {
  const { translate } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay">
      <h2 className="text-3xl font-bold text-navmax-accent mb-4">
        {translate('navigation.domainNotAllowed')}
      </h2>
      <p className="text-xl mb-6">
        {translate('navigation.domainNotAllowedDesc')}
      </p>
      <pre className="p-4 bg-navmax-muted rounded-xl mb-6 max-w-full overflow-x-auto">
        <code>{url}</code>
      </pre>
      <p className="text-center mb-8 max-w-md">
        For security reasons, NAVMAX restricts browsing to a pre-approved list of domains.
        Please navigate to an allowed domain or contact your administrator.
      </p>
      <Button 
        onClick={onReturnHome} 
        className="bg-navmax-accent hover:bg-navmax-accent/80 flex items-center gap-2"
      >
        <Home size={18} />
        {translate('navigation.returnToHome')}
      </Button>
    </div>
  );
}
