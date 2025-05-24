
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Lock, User, Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      toast.success("Conta criada com sucesso!");
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-paper-texture bg-opacity-10 bg-blend-overlay bg-gray-950 p-4">
      <div className="flex flex-col w-full max-w-md mx-auto justify-center">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 flex items-center gap-2 text-sm"
          onClick={() => navigate(-1)}
          id="back-button"
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 font-display">
              <span className="text-navmax-accent">NAV</span>
              <span>MAX</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Crie sua conta gratuita
            </p>
          </div>
          
          <Card className="border-navmax-light bg-navmax-muted">
            <CardHeader>
              <CardTitle className="text-xl">Criar Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name-input"
                      placeholder="Nome completo"
                      type="text"
                      className="pl-10 browser-input"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email-input"
                      placeholder="E-mail"
                      type="email"
                      className="pl-10 browser-input"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password-input"
                      placeholder="Senha"
                      type="password"
                      className="pl-10 browser-input"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="relative">
                    <Check className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password-input"
                      placeholder="Confirmar senha"
                      type="password"
                      className="pl-10 browser-input"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button
                  id="register-button"
                  type="submit"
                  className="w-full bg-navmax-accent hover:bg-navmax-accent/80"
                  disabled={isLoading}
                >
                  {isLoading ? "Criando conta..." : "Não Tenho Conta, Criar Minha Conta 100% Gratuita"}
                </Button>
                
                <div className="text-xs text-center text-muted-foreground pt-2">
                  Ao criar uma conta, você concorda com os nossos
                  <br />
                  <Button variant="link" className="h-auto p-0 text-navmax-accent hover:text-navmax-accent/80">
                    Termos de Uso
                  </Button>
                  {" "}e{" "}
                  <Button variant="link" className="h-auto p-0 text-navmax-accent hover:text-navmax-accent/80">
                    Política de Privacidade
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="text-center w-full">
                <Button
                  variant="link"
                  className="text-navmax-accent hover:text-navmax-accent/80"
                  onClick={() => navigate("/")}
                >
                  Já tenho uma conta, fazer login
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
