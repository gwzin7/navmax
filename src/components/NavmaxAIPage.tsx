import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Zap, Send, ThumbsUp, ThumbsDown, ClipboardCopy, Lightbulb, Search, ArrowLeft, Mic, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/language/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface Suggestion {
  id: string;
  text: string;
}

const NavmaxAIPage = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Olá! Sou o assistente IntelliMAX. Como posso ajudá-lo hoje?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'settings'>('chat');
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognition = useRef<SpeechRecognition | null>(null);
  
  const [suggestions] = useState<Suggestion[]>([
    { id: '1', text: "Como você pode me ajudar com pesquisas?" },
    { id: '2', text: "Quais são os recursos de privacidade do IntelliMAX?" },
    { id: '3', text: "Você pode resumir artigos para mim?" },
    { id: '4', text: "Como faço para gerenciar meu histórico de navegação?" }
  ]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      
      if (recognition.current) {
        recognition.current.continuous = false;
        recognition.current.interimResults = false;
        recognition.current.lang = 'pt-BR';
        
        recognition.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
          
          if (inputRef.current) {
            inputRef.current.focus();
          }
        };
        
        recognition.current.onerror = () => {
          setIsListening(false);
          toast({
            title: "Erro na captura de voz",
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

  // Always scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  // Focus input when page loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleStartVoiceInput = () => {
    if (recognition.current) {
      setIsListening(true);
      
      toast({
        title: "Escutando...",
        description: "Fale sua mensagem"
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

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue;
    
    if (!messageContent.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsThinking(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      // Mock response based on query
      let responseContent = "";
      const loweredContent = messageContent.toLowerCase();
      
      if (loweredContent.includes('pesquisa') || loweredContent.includes('busca')) {
        responseContent = "Posso ajudar com suas pesquisas! O IntelliMAX oferece um mecanismo de busca avançado que combina resultados tradicionais com IA para dar respostas mais precisas e personalizadas. Para utilizar, basta digitar sua pergunta na barra de pesquisa principal ou aqui mesmo no chat.";
      } else if (loweredContent.includes('privacidade') || loweredContent.includes('segurança')) {
        responseContent = "O IntelliMAX prioriza sua privacidade! Oferecemos bloqueio de rastreadores, navegação anônima, e opções para limpar histórico e cookies automaticamente. Você pode ajustar suas configurações de privacidade no menu Configurações > Privacidade.";
      } else if (loweredContent.includes('resumir') || loweredContent.includes('resumo')) {
        responseContent = "Sim! Posso resumir artigos e páginas para você. Navegando em uma página, clique no ícone da IA na barra lateral e selecione 'Resumir'. Você também pode copiar um texto e pedir para eu resumir aqui mesmo no chat.";
      } else if (loweredContent.includes('histórico')) {
        responseContent = "Para gerenciar seu histórico de navegação, acesse a seção 'Histórico' no menu principal. Lá você pode visualizar, buscar sites visitados e excluir itens específicos ou todo o histórico. Também é possível configurar limpeza automática nas Configurações.";
      } else if (loweredContent.includes('olá') || loweredContent.includes('oi') || loweredContent.includes('ola')) {
        responseContent = "Olá! É um prazer conversar com você. Como posso ajudar com sua experiência no IntelliMAX hoje?";
      } else {
        responseContent = "Obrigado pela sua pergunta! Como assistente do IntelliMAX, posso ajudar com informações sobre navegação, busca, privacidade e recursos do navegador. Posso responder perguntas gerais, resumir conteúdos e auxiliar na sua experiência online. Como posso ajudar mais especificamente?";
      }
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: responseContent,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsThinking(false);
    }, 1500);
  };

  const handleFeedback = (messageId: string, isPositive: boolean) => {
    toast({
      title: isPositive ? "Feedback positivo enviado" : "Feedback negativo enviado",
      description: "Obrigado pelo seu feedback! Isso nos ajuda a melhorar.",
      duration: 3000,
    });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Texto copiado",
      description: "O conteúdo foi copiado para sua área de transferência.",
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay">
      <div className="flex items-center p-4 border-b border-navmax-light">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mr-2"
          id="back-button"
        >
          <ArrowLeft size={18} />
        </Button>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-navmax-accent bg-opacity-20">
            <Zap className="h-5 w-5 text-navmax-accent" />
          </div>
          <h1 className="text-xl font-bold">IntelliMAX Assistente</h1>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col p-4 md:p-6">
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'chat' | 'settings')}
          className="flex-1 flex flex-col"
        >
          <TabsList className="mb-4 self-center bg-navmax-muted">
            <TabsTrigger value="chat" id="chat-tab">Chat</TabsTrigger>
            <TabsTrigger value="settings" id="settings-tab">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col rounded-xl border border-navmax-light overflow-hidden bg-navmax-muted">
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-xl p-4 ${
                          message.isUser 
                            ? 'bg-navmax-accent text-white' 
                            : 'bg-navmax-dark border border-navmax-light'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        {!message.isUser && (
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-navmax-light border-opacity-20">
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-7 w-7 text-navmax-foreground/60 hover:text-navmax-foreground"
                                onClick={() => handleFeedback(message.id, true)}
                                id={`thumbs-up-${message.id}`}
                              >
                                <ThumbsUp size={14} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-7 w-7 text-navmax-foreground/60 hover:text-navmax-foreground"
                                onClick={() => handleFeedback(message.id, false)}
                                id={`thumbs-down-${message.id}`}
                              >
                                <ThumbsDown size={14} />
                              </Button>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-7 w-7 text-navmax-foreground/60 hover:text-navmax-foreground"
                              onClick={() => copyToClipboard(message.content)}
                              id={`copy-${message.id}`}
                            >
                              <ClipboardCopy size={14} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isThinking && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-xl p-4 bg-navmax-dark border border-navmax-light">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-navmax-accent animate-pulse" />
                          <div className="w-2 h-2 rounded-full bg-navmax-accent animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 rounded-full bg-navmax-accent animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-navmax-light">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center"
                >
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Envie uma mensagem..."
                    className="flex-1 bg-navmax border border-navmax-light focus:border-navmax-accent"
                    disabled={isThinking || isListening}
                    id="message-input"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2"
                    onClick={handleStartVoiceInput}
                    disabled={isThinking || isListening}
                    id="voice-input-button"
                  >
                    <Mic size={18} className={isListening ? "text-navmax-accent animate-pulse" : "text-navmax-foreground/50"} />
                  </Button>
                  <Button 
                    type="submit" 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2"
                    disabled={!inputValue.trim() || isThinking || isListening}
                    id="send-message-button"
                  >
                    <Send size={18} className={inputValue.trim() ? "text-navmax-accent" : "text-navmax-foreground/50"} />
                  </Button>
                </form>
              </div>
            </div>
            
            {messages.length <= 2 && (
              <div className="mt-6">
                <div className="flex items-center mb-4">
                  <Lightbulb size={16} className="mr-2 text-navmax-accent" />
                  <h3 className="font-semibold">Sugestões</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suggestions.map(suggestion => (
                    <Button 
                      key={suggestion.id}
                      variant="outline" 
                      className="justify-start text-left h-auto py-3"
                      onClick={() => handleSendMessage(suggestion.text)}
                      id={`suggestion-${suggestion.id}`}
                    >
                      <Search size={14} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{suggestion.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="flex-1">
            <div className="rounded-xl border border-navmax-light bg-navmax-muted p-6">
              <h2 className="text-xl font-bold mb-6">Configurações do Assistente</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Comportamento</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Busca na Web</p>
                      <p className="text-sm text-muted-foreground">Permitir que o assistente busque informações na internet</p>
                    </div>
                    <Switch
                      checked={webSearchEnabled}
                      onCheckedChange={setWebSearchEnabled}
                      className="data-[state=checked]:bg-navmax-accent"
                      id="web-search-toggle"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sugestões automáticas</p>
                      <p className="text-sm text-muted-foreground">Mostrar sugestões baseadas no contexto</p>
                    </div>
                    <Switch
                      checked={true}
                      className="data-[state=checked]:bg-navmax-accent"
                      id="suggestions-toggle"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Histórico de conversas</p>
                      <p className="text-sm text-muted-foreground">Salvar histórico de conversas</p>
                    </div>
                    <Switch
                      checked={true}
                      className="data-[state=checked]:bg-navmax-accent"
                      id="history-toggle"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Privacidade</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Modo privado</p>
                      <p className="text-sm text-muted-foreground">Não salvar conversas no histórico</p>
                    </div>
                    <Switch
                      className="data-[state=checked]:bg-navmax-accent"
                      id="private-mode-toggle"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-500"
                      id="clear-history-button"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Limpar histórico de conversas
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NavmaxAIPage;
