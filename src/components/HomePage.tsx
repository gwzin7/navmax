
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/language/LanguageContext";
import SearchBar from "./SearchBar";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { TrendingUp, Star, Clock, Compass, Mail, Settings, Bookmark, History, User, Download, Brain, Mic, Shield } from "lucide-react";

const HomePage = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();

  // Mock recent searches
  const recentSearches = [{
    term: "tendências de marketing digital 2025",
    icon: <TrendingUp size={18} />
  }, {
    term: "ferramentas de desenvolvimento web",
    icon: <Compass size={18} />
  }, {
    term: "inspiração de design",
    icon: <Star size={18} />
  }, {
    term: "aplicativos de produtividade",
    icon: <Clock size={18} />
  }];

  // Quick access links
  const quickLinks = [
    {
      title: "Favoritos",
      icon: <Bookmark size={20} />,
      route: "/bookmarks",
      id: "bookmarks-button"
    }, 
    {
      title: "Histórico",
      icon: <History size={20} />,
      route: "/history",
      id: "history-button"
    }, 
    {
      title: "Email",
      icon: <Mail size={20} />,
      route: "/mail",
      id: "email-button"
    }, 
    {
      title: "Configurações",
      icon: <Settings size={20} />,
      route: "/settings",
      id: "settings-button"
    },
    {
      title: "Perfis",
      icon: <User size={20} />,
      route: "/profiles",
      id: "profiles-button"
    },
    {
      title: "Download Anônimo",
      icon: <Download size={20} />,
      route: "/downloads",
      id: "downloads-button"
    },
    {
      title: "Assistente IA",
      icon: <Brain size={20} />,
      route: "/ai",
      id: "ai-button"
    },
    {
      title: "Privacidade",
      icon: <Shield size={20} />,
      route: "/privacy",
      id: "privacy-button"
    }
  ];
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col bg-paper-texture bg-opacity-10 bg-blend-overlay p-6 bg-gray-950"
    >
      <div className="max-w-4xl mx-auto w-full mt-8 md:mt-12 mb-12">
        {/* Logo */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }} 
          className="text-center mb-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-2 font-display">
            <span className="text-navmax-accent">NAV</span>
            <span>MAX</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Pesquisa inteligente para um mundo digital
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }} 
          className="mb-10"
        >
          <SearchBar onSearch={(query) => navigate(`/search?q=${encodeURIComponent(query || '')}`)} showToggle={true} />
        </motion.div>

        {/* Quick Access */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }} 
          className="mb-10"
        >
          <h2 className="text-lg font-bold mb-4">
            Acesso Rápido
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {quickLinks.map((link) => (
              <motion.div 
                key={link.route} 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  variant="outline" 
                  className="w-full h-auto py-5 flex flex-col gap-2 border-navmax-light hover:border-navmax-accent hover:bg-navmax-accent/10" 
                  onClick={() => navigate(link.route)}
                  id={link.id}
                >
                  <div className="text-navmax-accent">{link.icon}</div>
                  <span>{link.title}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Create Account Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
          className="mb-10 text-center"
        >
          <Button
            variant="default"
            size="lg"
            className="bg-navmax-accent hover:bg-navmax-accent/90 text-white font-medium py-6 px-8 rounded-lg shadow-lg transition-all"
            onClick={() => navigate("/register")}
            id="create-account-button"
          >
            Não Tenho Conta, Criar Minha Conta 100% Gratuita
          </Button>
        </motion.div>

        {/* Recent Searches */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-navmax-accent" />
            <h2 className="text-lg font-bold">
              Pesquisas Recentes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentSearches.map((item, index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-navmax-muted border-navmax-light hover:border-navmax-accent/50 transition-all duration-200 cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="text-navmax-accent">
                      {item.icon}
                    </div>
                    <p className="text-sm font-medium truncate">{item.term}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Brand Footer */}
      <div className="mt-auto flex justify-end">
        <div className="text-xs text-muted-foreground">
          <span>Desenvolvido por </span>
          <span className="font-bold">NavMAX</span>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
