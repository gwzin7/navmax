
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserPlus, Lock, Settings, ArrowLeft, Check, Trash2, Edit, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/language/LanguageContext";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  isPasswordProtected: boolean;
  isActive?: boolean;
  type: 'personal' | 'work' | 'family' | 'custom';
}

const MultiUserPage = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([
    { id: "1", name: "Perfil Padrão", avatar: undefined, isPasswordProtected: false, isActive: true, type: 'personal' },
    { id: "2", name: "Perfil Trabalho", avatar: undefined, isPasswordProtected: true, type: 'work' },
    { id: "3", name: "Perfil Família", avatar: undefined, isPasswordProtected: false, type: 'family' },
  ]);
  
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileType, setNewProfileType] = useState<UserProfile['type']>('custom');
  const [newProfilePassword, setNewProfilePassword] = useState("");
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [activeDialog, setActiveDialog] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Set initial active profile (could be loaded from localStorage or API)
    const active = profiles.find(p => p.isActive);
    if (active) {
      setSelectedProfile(active);
    }
  }, []);

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      const newProfile: UserProfile = {
        id: Date.now().toString(),
        name: newProfileName,
        isPasswordProtected: isPasswordProtected,
        type: newProfileType
      };
      
      setProfiles([...profiles, newProfile]);
      resetNewProfileForm();
      setActiveDialog(null);
      
      toast({
        title: "Perfil criado",
        description: `Perfil "${newProfileName}" foi criado com sucesso.`
      });
    }
  };

  const handleUpdateProfile = () => {
    if (!editingProfile || !editingProfile.name.trim()) return;
    
    const updatedProfiles = profiles.map(p => 
      p.id === editingProfile.id ? editingProfile : p
    );
    
    setProfiles(updatedProfiles);
    setEditingProfile(null);
    setActiveDialog(null);
    
    toast({
      title: "Perfil atualizado",
      description: `As alterações foram salvas com sucesso.`
    });
  };

  const handleDeleteProfile = () => {
    if (!editingProfile) return;
    
    // Don't allow deleting active profile
    if (editingProfile.isActive) {
      toast({
        title: "Não é possível excluir",
        description: "Não é possível excluir o perfil ativo. Alterne para outro perfil primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedProfiles = profiles.filter(p => p.id !== editingProfile.id);
    setProfiles(updatedProfiles);
    setEditingProfile(null);
    setActiveDialog(null);
    
    toast({
      title: "Perfil excluído",
      description: `Perfil "${editingProfile.name}" foi excluído.`
    });
  };

  const handleSelectProfile = (profile: UserProfile) => {
    setSelectedProfile(profile);
    
    // Update active state
    const updatedProfiles = profiles.map(p => ({
      ...p,
      isActive: p.id === profile.id
    }));
    
    setProfiles(updatedProfiles);
    
    toast({
      title: "Perfil selecionado",
      description: `Você está usando o perfil "${profile.name}" agora.`,
      action: profile.isPasswordProtected ? 
        <Button variant="outline" size="sm" onClick={() => console.log("Desbloqueando...")}>
          Desbloquear
        </Button> : undefined
    });
  };

  const resetNewProfileForm = () => {
    setNewProfileName("");
    setNewProfileType('custom');
    setNewProfilePassword("");
    setIsPasswordProtected(false);
  };

  const openEditDialog = (profile: UserProfile) => {
    setEditingProfile({...profile});
    setActiveDialog('edit');
  };

  const openDeleteDialog = (profile: UserProfile) => {
    setEditingProfile({...profile});
    setActiveDialog('delete');
  };

  return (
    <div className="flex flex-col h-screen bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay">
      <div className="flex items-center p-4 border-b border-navmax-light">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-xl font-bold flex-1">Gerenciamento de Perfis</h1>
        
        <Dialog open={activeDialog === 'create'} onOpenChange={(open) => {
          if (open) setActiveDialog('create');
          else {
            setActiveDialog(null);
            resetNewProfileForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-navmax-accent hover:bg-navmax-accent/90">
              <UserPlus size={16} className="mr-2" />
              Novo Perfil
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-navmax-muted">
            <DialogHeader>
              <DialogTitle>Criar Novo Perfil</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-navmax-accent/20 text-navmax-accent">
                    {newProfileName ? newProfileName.substring(0, 2).toUpperCase() : "NP"}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <Input
                placeholder="Nome do perfil"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="mb-4"
              />
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Proteger com senha</span>
                <Switch
                  checked={isPasswordProtected}
                  onCheckedChange={setIsPasswordProtected}
                  className="data-[state=checked]:bg-navmax-accent"
                />
              </div>
              
              {isPasswordProtected && (
                <Input
                  type="password"
                  placeholder="Senha de proteção"
                  value={newProfilePassword}
                  onChange={(e) => setNewProfilePassword(e.target.value)}
                />
              )}
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setActiveDialog(null)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateProfile} 
                  disabled={!newProfileName.trim()}
                  className="flex-1 bg-navmax-accent hover:bg-navmax-accent/80"
                >
                  Criar Perfil
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map(profile => (
            <div 
              key={profile.id}
              onClick={() => handleSelectProfile(profile)}
              className={`relative flex flex-col items-center p-6 rounded-xl bg-navmax-muted border ${profile.isActive ? 'border-navmax-accent' : 'border-navmax-light'} hover:border-navmax-accent transition-all cursor-pointer ${profile.isActive ? 'ring-1 ring-navmax-accent ring-opacity-50' : ''}`}
            >
              {profile.isActive && (
                <div className="absolute -top-2 -right-2 bg-navmax-accent text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}
              
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className={`${profile.isActive ? 'bg-navmax-accent text-white' : 'bg-navmax-accent/20 text-navmax-accent'}`}>
                  {profile.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold mb-2">{profile.name}</h2>
              <div className="flex flex-wrap space-x-2 mt-3 justify-center">
                <span className="text-xs bg-navmax-dark px-2 py-1 rounded">
                  {profile.type === 'personal' ? 'Pessoal' : 
                   profile.type === 'work' ? 'Trabalho' :
                   profile.type === 'family' ? 'Família' : 'Personalizado'}
                </span>
                {profile.isPasswordProtected && (
                  <span className="text-xs bg-navmax-accent/20 text-navmax-accent px-2 py-1 rounded flex items-center">
                    <Lock size={10} className="mr-1" /> Protegido
                  </span>
                )}
              </div>
              
              <div className="absolute top-3 right-3 flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditDialog(profile);
                  }}
                >
                  <Edit size={14} />
                </Button>
                {!profile.isActive && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteDialog(profile);
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          <Dialog open={activeDialog === 'create'} onOpenChange={(open) => {
            if (open) setActiveDialog('create');
            else {
              setActiveDialog(null);
              resetNewProfileForm();
            }
          }}>
            <DialogTrigger asChild>
              <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-navmax-light hover:border-navmax-accent transition-all cursor-pointer">
                <UserPlus size={48} className="mb-4 text-navmax-accent" />
                <p className="text-lg">Adicionar Novo Perfil</p>
              </div>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>
      
      {/* Edit Profile Dialog */}
      <Dialog open={activeDialog === 'edit'} onOpenChange={(open) => {
        if (!open) {
          setActiveDialog(null);
          setEditingProfile(null);
        }
      }}>
        <DialogContent className="bg-navmax-muted">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          {editingProfile && (
            <div className="space-y-4 pt-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-navmax-accent/20 text-navmax-accent">
                    {editingProfile.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <Input
                placeholder="Nome do perfil"
                value={editingProfile.name}
                onChange={(e) => setEditingProfile({...editingProfile, name: e.target.value})}
              />
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Proteger com senha</span>
                <Switch
                  checked={editingProfile.isPasswordProtected}
                  onCheckedChange={(checked) => setEditingProfile({...editingProfile, isPasswordProtected: checked})}
                  className="data-[state=checked]:bg-navmax-accent"
                />
              </div>
              
              {editingProfile.isPasswordProtected && (
                <div className="flex items-center gap-2">
                  <Input
                    type="password"
                    placeholder="Nova senha (deixe vazio para manter)"
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Key size={16} />
                  </Button>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setActiveDialog(null)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleUpdateProfile} 
                  disabled={!editingProfile.name.trim()}
                  className="flex-1 bg-navmax-accent hover:bg-navmax-accent/80"
                >
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Profile Confirmation Dialog */}
      <Dialog open={activeDialog === 'delete'} onOpenChange={(open) => {
        if (!open) {
          setActiveDialog(null);
          setEditingProfile(null);
        }
      }}>
        <DialogContent className="bg-navmax-muted">
          <DialogHeader>
            <DialogTitle>Excluir Perfil</DialogTitle>
          </DialogHeader>
          {editingProfile && (
            <div className="space-y-4 pt-4">
              <p>Tem certeza que deseja excluir o perfil "{editingProfile.name}"?</p>
              <p className="text-sm text-muted-foreground">Esta ação não pode ser desfeita.</p>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setActiveDialog(null)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleDeleteProfile}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Excluir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <div className="p-6 text-xs text-navmax-foreground/50 absolute right-0 bottom-0">
        NAVMAX
      </div>
    </div>
  );
};

export default MultiUserPage;
