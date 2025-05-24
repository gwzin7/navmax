
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { User, AuthState } from "./types";

// Mock users for demo
const mockUsers: User[] = [
  {
    id: "1",
    name: "Usuário Demo",
    email: "demo@agenciamax.com",
    password: "password123"
  },
  {
    id: "2",
    name: "Administrador",
    email: "admin@agenciamax.com",
    password: "admin123"
  },
  {
    id: "3",
    name: "Teste NAVMAX",
    email: "teste@navmax.com",
    password: "teste123"
  }
];

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    // Try to get user from localStorage on initial load
    const storedUser = localStorage.getItem("navmax_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        return {
          user,
          isAuthenticated: true
        };
      } catch (e) {
        console.error("Falha ao analisar usuário armazenado", e);
        localStorage.removeItem("navmax_user");
      }
    }
    return initialState;
  });

  // Save user to localStorage when auth state changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("navmax_user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("navmax_user");
    }
  }, [state.user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const user = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (user) {
      // Don't store password in state
      const { password: _, ...safeUser } = user;
      setState({
        user: { ...safeUser, password: "" },
        isAuthenticated: true
      });
      toast.success(`Bem-vindo(a), ${user.name}!`);
      
      return true;
    }
    
    toast.error("Email ou senha inválidos");
    return false;
  };

  const logout = () => {
    setState(initialState);
    toast.info("Você saiu da sua conta");
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      setState({
        ...state,
        user: updatedUser
      });
      toast.success("Perfil atualizado com sucesso");
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
