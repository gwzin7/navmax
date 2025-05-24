
import React, { useState } from "react";
import { ArrowLeft, Download, FileDown, CheckCircle2, Clock, AlertTriangle, Ban, Trash2, Eye, EyeOff, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DownloadItem {
  id: string;
  filename: string;
  url: string;
  size: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'paused' | 'failed' | 'cancelled';
  date: Date;
  isAnonymous: boolean;
}

const DownloadManagerPage = () => {
  const navigate = useNavigate();
  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
      id: '1',
      filename: 'navmax-browser-latest.exe',
      url: 'https://navmax.com/downloads/navmax-browser-latest.exe',
      size: '45.8 MB',
      progress: 100,
      status: 'completed',
      date: new Date(2025, 4, 22),
      isAnonymous: true
    },
    {
      id: '2',
      filename: 'report-q1-2025.pdf',
      url: 'https://example.com/files/report-q1-2025.pdf',
      size: '2.3 MB',
      progress: 100,
      status: 'completed',
      date: new Date(2025, 4, 21),
      isAnonymous: false
    },
    {
      id: '3',
      filename: 'project-presentation.pptx',
      url: 'https://example.com/files/project-presentation.pptx',
      size: '8.7 MB',
      progress: 65,
      status: 'in-progress',
      date: new Date(),
      isAnonymous: true
    },
    {
      id: '4',
      filename: 'design-assets.zip',
      url: 'https://example.com/files/design-assets.zip',
      size: '125.4 MB',
      progress: 34,
      status: 'paused',
      date: new Date(),
      isAnonymous: false
    },
    {
      id: '5',
      filename: 'software-update.dmg',
      url: 'https://example.com/files/software-update.dmg',
      size: '78.2 MB',
      progress: 0,
      status: 'failed',
      date: new Date(2025, 4, 20),
      isAnonymous: true
    }
  ]);
  
  const [anonymousMode, setAnonymousMode] = useState(true);
  const [isNewDownloadDialogOpen, setIsNewDownloadDialogOpen] = useState(false);
  const [newDownloadUrl, setNewDownloadUrl] = useState("");
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  
  const handleStatusAction = (id: string, action: 'resume' | 'pause' | 'cancel' | 'retry' | 'remove') => {
    let message = '';
    
    switch (action) {
      case 'resume':
        message = 'Download retomado';
        setDownloads(downloads.map(d => d.id === id ? { ...d, status: 'in-progress' as const } : d));
        break;
      case 'pause':
        message = 'Download pausado';
        setDownloads(downloads.map(d => d.id === id ? { ...d, status: 'paused' as const } : d));
        break;
      case 'cancel':
        message = 'Download cancelado';
        setDownloads(downloads.map(d => d.id === id ? { ...d, status: 'cancelled' as const } : d));
        break;
      case 'retry':
        message = 'Tentando novamente...';
        setDownloads(downloads.map(d => d.id === id ? { ...d, status: 'in-progress' as const, progress: 0 } : d));
        break;
      case 'remove':
        message = 'Download removido';
        setDownloads(downloads.filter(d => d.id !== id));
        break;
    }
    
    toast({
      title: message
    });
  };
  
  const handleStartNewDownload = () => {
    if (!newDownloadUrl.trim()) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida para download",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new download item
    const filename = newDownloadUrl.substring(newDownloadUrl.lastIndexOf('/') + 1);
    
    const newDownload: DownloadItem = {
      id: Date.now().toString(),
      filename,
      url: newDownloadUrl,
      size: 'Calculando...',
      progress: 0,
      status: 'in-progress',
      date: new Date(),
      isAnonymous: anonymousMode
    };
    
    setDownloads([newDownload, ...downloads]);
    setNewDownloadUrl("");
    setIsNewDownloadDialogOpen(false);
    
    toast({
      title: "Download iniciado",
      description: filename
    });
    
    // Simulate download progress
    simulateDownloadProgress(newDownload.id);
  };
  
  const simulateDownloadProgress = (id: string) => {
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10);
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setDownloads(downloads => downloads.map(d => 
          d.id === id ? { ...d, progress: 100, status: 'completed', size: `${(Math.random() * 100).toFixed(1)} MB` } : d
        ));
      } else {
        setDownloads(downloads => downloads.map(d => 
          d.id === id ? { ...d, progress } : d
        ));
      }
    }, 1000);
  };
  
  const handleClearCompleted = () => {
    setDownloads(downloads.filter(d => d.status !== 'completed'));
    setIsClearDialogOpen(false);
    
    toast({
      title: "Downloads concluídos removidos"
    });
  };
  
  const getStatusIcon = (status: DownloadItem['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'paused': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'cancelled': return <Ban className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: DownloadItem['status']) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in-progress': return 'Em andamento';
      case 'paused': return 'Pausado';
      case 'failed': return 'Falhou';
      case 'cancelled': return 'Cancelado';
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay">
      <div className="flex items-center justify-between p-4 border-b border-navmax-light">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-xl font-bold">Downloads</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            <span className="text-sm">Modo anônimo</span>
            <Switch
              checked={anonymousMode}
              onCheckedChange={setAnonymousMode}
              className="data-[state=checked]:bg-navmax-accent"
            />
          </div>
          
          <Dialog open={isNewDownloadDialogOpen} onOpenChange={setIsNewDownloadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-navmax-accent hover:bg-navmax-accent/90">
                <Download size={16} className="mr-2" />
                Novo Download
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-navmax-muted border-navmax-light">
              <DialogHeader>
                <DialogTitle>Novo Download</DialogTitle>
                <DialogDescription>
                  Digite a URL do arquivo que você deseja baixar.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="url">URL do arquivo</Label>
                  <Input
                    id="url"
                    placeholder="https://exemplo.com/arquivo.pdf"
                    value={newDownloadUrl}
                    onChange={(e) => setNewDownloadUrl(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="anonymous"
                    checked={anonymousMode}
                    onCheckedChange={setAnonymousMode}
                    className="data-[state=checked]:bg-navmax-accent"
                  />
                  <Label htmlFor="anonymous">Download anônimo</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewDownloadDialogOpen(false)}>Cancelar</Button>
                <Button className="bg-navmax-accent hover:bg-navmax-accent/90" onClick={handleStartNewDownload}>Iniciar Download</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Trash2 size={16} className="mr-2" />
                Limpar Concluídos
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-navmax-muted border-navmax-light">
              <DialogHeader>
                <DialogTitle>Limpar Downloads Concluídos</DialogTitle>
                <DialogDescription>
                  Esta ação removerá todos os downloads concluídos da lista. Você tem certeza?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsClearDialogOpen(false)}>Cancelar</Button>
                <Button variant="destructive" onClick={handleClearCompleted}>Limpar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        {downloads.length > 0 ? (
          <div className="rounded-xl border border-navmax-light bg-navmax-muted overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-navmax-dark hover:bg-navmax-dark">
                  <TableHead className="w-[40%]">Nome</TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                  <TableHead className="w-[15%]">Tamanho</TableHead>
                  <TableHead className="w-[10%]">Privacidade</TableHead>
                  <TableHead className="w-[10%]">Data</TableHead>
                  <TableHead className="w-[10%] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {downloads.map((download) => (
                  <TableRow key={download.id} className="hover:bg-navmax-dark/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileDown size={16} className="text-navmax-accent" />
                        <span className="truncate">{download.filename}</span>
                      </div>
                      {download.status === 'in-progress' && (
                        <Progress value={download.progress} className="h-1 mt-1" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(download.status)}
                        <span className="text-sm">{getStatusText(download.status)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{download.size}</TableCell>
                    <TableCell>{download.isAnonymous ? 
                      <div className="flex items-center gap-1"><Eye size={14} /> Anônimo</div> : 
                      <div className="flex items-center gap-1"><EyeOff size={14} /> Normal</div>
                    }</TableCell>
                    <TableCell>{download.date.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronDown size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-navmax-muted border-navmax-light">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {download.status === 'completed' && (
                            <>
                              <DropdownMenuItem onClick={() => toast({ title: `Abrindo ${download.filename}` })}>
                                Abrir
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast({ title: `Abrindo pasta` })}>
                                Mostrar na pasta
                              </DropdownMenuItem>
                            </>
                          )}
                          {download.status === 'in-progress' && (
                            <DropdownMenuItem onClick={() => handleStatusAction(download.id, 'pause')}>
                              Pausar
                            </DropdownMenuItem>
                          )}
                          {download.status === 'paused' && (
                            <DropdownMenuItem onClick={() => handleStatusAction(download.id, 'resume')}>
                              Retomar
                            </DropdownMenuItem>
                          )}
                          {(download.status === 'in-progress' || download.status === 'paused') && (
                            <DropdownMenuItem onClick={() => handleStatusAction(download.id, 'cancel')}>
                              Cancelar
                            </DropdownMenuItem>
                          )}
                          {download.status === 'failed' && (
                            <DropdownMenuItem onClick={() => handleStatusAction(download.id, 'retry')}>
                              Tentar novamente
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleStatusAction(download.id, 'remove')}
                            className="text-red-500"
                          >
                            Remover da lista
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <Download size={48} className="text-navmax-foreground/30 mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhum download</h3>
            <p className="text-navmax-foreground/60 mb-6 text-center max-w-md">
              Seus downloads aparecerão aqui. Clique em "Novo Download" para começar.
            </p>
            <Button 
              className="bg-navmax-accent hover:bg-navmax-accent/90"
              onClick={() => setIsNewDownloadDialogOpen(true)}
            >
              <Download size={16} className="mr-2" />
              Novo Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadManagerPage;
