
import { useState } from "react";
import { LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/language/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

export default function LoginButton() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { translate } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        setOpen(false);
        setEmail("");
        setPassword("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // In a real implementation, this would handle OAuth flow
    setIsLoading(true);
    
    // Simulate social login
    setTimeout(() => {
      setIsLoading(false);
      login("user@example.com", "password"); // This is just a simulation
      setOpen(false);
    }, 1500);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  const handleCreateAccount = () => {
    setOpen(false);
    navigate("/register");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="hover:bg-navmax-accent/20 hover:text-navmax-accent"
          id="login-button"
        >
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <User size={18} />
              <span className="hidden sm:inline">{user?.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <LogIn size={18} />
              <span className="hidden sm:inline">Entrar</span>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 bg-navmax-muted border-navmax-light">
        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-navmax-foreground">Conectado como</p>
              <h3 className="font-bold text-navmax-foreground">{user?.name}</h3>
              <p className="text-xs text-navmax-foreground/70">{user?.email}</p>
            </div>
            <Button 
              onClick={handleLogout} 
              className="w-full bg-navmax-accent hover:bg-navmax-accent/80"
              id="logout-button"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-center">Entrar no NavMAX</h3>
              <p className="text-sm text-center text-muted-foreground">
                Acesse sua conta para sincronizar dados
              </p>
            </div>
            
            {/* Social Login Options */}
            <div className="flex flex-col gap-3">
              <Button 
                type="button"
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                id="google-login-button"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuar com Google
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSocialLogin('apple')}
                disabled={isLoading}
                id="apple-login-button"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-.999-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.547 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                </svg>
                Continuar com Apple
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSocialLogin('navmax')}
                disabled={isLoading}
                id="navmax-login-button"
              >
                <span className="mr-2 font-bold">
                  <span className="text-navmax-accent">N</span>
                  <span>M</span>
                </span>
                Conta NavMAX
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-navmax-muted px-2 text-muted-foreground">
                  ou
                </span>
              </div>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="E-mail"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="browser-input"
                  id="email-input"
                />
                
                <Input
                  type="password"
                  placeholder="Senha"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="browser-input"
                  id="password-input"
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-navmax-accent hover:bg-navmax-accent/80"
                  disabled={isLoading}
                  id="submit-login-button"
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </div>
            </form>
            
            <div className="text-center">
              <Button
                variant="link"
                className="text-navmax-accent hover:text-navmax-accent/80"
                onClick={handleCreateAccount}
                id="create-account-link"
              >
                Não Tenho Conta, Criar Minha Conta 100% Gratuita
              </Button>
            </div>
            
            <div className="text-xs text-center text-muted-foreground">
              <p>Contas de demonstração</p>
              <p>demo@navmax.com / password123</p>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
