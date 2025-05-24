
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/language/LanguageContext";
import { 
  ArrowLeft,
  Mail, 
  Inbox,
  Send,
  File,
  Trash2,
  Star,
  Search,
  Plus,
  X,
  ChevronDown,
  Settings,
  RefreshCw,
  Filter,
  Bell,
  Download
} from "lucide-react";
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
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "sonner";

// Mock email accounts
const mockEmailAccounts = [
  {
    id: 1,
    name: "Work",
    email: "work@example.com",
    provider: "gmail",
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234285F4' width='24' height='24'%3E%3Cpath d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='%2334A853'/%3E%3Cpath d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='%23FBBC05'/%3E%3Cpath d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='%23EA4335'/%3E%3Cpath d='M1 1h22v22H1z' fill='none'/%3E%3C/svg%3E"
  },
  {
    id: 2,
    name: "Personal",
    email: "personal@example.com",
    provider: "outlook",
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath d='M0 3v18h24V3H0zm6.6 6.6v-3L12 9l5.4-2.4v3L12 12l-5.4-2.4z' fill='%230078D4'/%3E%3C/svg%3E"
  }
];

// Mock emails
const mockEmails = [
  {
    id: 101,
    accountId: 1,
    from: {
      name: "GitHub",
      email: "noreply@github.com"
    },
    to: "work@example.com",
    subject: "Your repository has a new star",
    body: "Someone just starred your repository! Check it out now.",
    date: new Date(),
    read: false,
    starred: true,
    folder: "inbox"
  },
  {
    id: 102,
    accountId: 1,
    from: {
      name: "LinkedIn",
      email: "messages-noreply@linkedin.com"
    },
    to: "work@example.com",
    subject: "New message from John Doe",
    body: "John Doe sent you a message on LinkedIn. You have a new connection request from John Doe.",
    date: new Date(new Date().setHours(new Date().getHours() - 2)),
    read: true,
    starred: false,
    folder: "inbox"
  },
  {
    id: 103,
    accountId: 1,
    from: {
      name: "Amazon",
      email: "orders@amazon.com"
    },
    to: "work@example.com",
    subject: "Your order has shipped",
    body: "Your recent order #12345 has shipped and is on its way to you. Track your package here.",
    date: new Date(new Date().setHours(new Date().getHours() - 5)),
    read: true,
    starred: false,
    folder: "inbox"
  },
  {
    id: 201,
    accountId: 2,
    from: {
      name: "Netflix",
      email: "info@netflix.com"
    },
    to: "personal@example.com",
    subject: "New shows added to your list",
    body: "Check out the new shows and movies we've added based on your preferences. Start watching now!",
    date: new Date(new Date().setHours(new Date().getHours() - 3)),
    read: false,
    starred: false,
    folder: "inbox"
  },
  {
    id: 202,
    accountId: 2,
    from: {
      name: "Spotify",
      email: "no-reply@spotify.com"
    },
    to: "personal@example.com",
    subject: "Your weekly playlist is ready",
    body: "Your weekly playlist has been refreshed with new music based on your listening habits. Enjoy!",
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    read: true,
    starred: true,
    folder: "inbox"
  },
  {
    id: 301,
    accountId: 1,
    from: {
      name: "Me",
      email: "work@example.com"
    },
    to: "client@example.com",
    subject: "Project proposal",
    body: "Here is the project proposal we discussed. Let me know your thoughts.",
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    read: true,
    starred: false,
    folder: "sent"
  }
];

// Email providers options
const emailProviders = [
  { id: "gmail", name: "Gmail", icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234285F4' width='24' height='24'%3E%3Cpath d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='%2334A853'/%3E%3Cpath d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='%23FBBC05'/%3E%3Cpath d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='%23EA4335'/%3E%3Cpath d='M1 1h22v22H1z' fill='none'/%3E%3C/svg%3E" },
  { id: "outlook", name: "Outlook", icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath d='M0 3v18h24V3H0zm6.6 6.6v-3L12 9l5.4-2.4v3L12 12l-5.4-2.4z' fill='%230078D4'/%3E%3C/svg%3E" },
  { id: "yahoo", name: "Yahoo Mail", icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath d='M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm0 4.551a7.449 7.449 0 1 0 0 14.898 7.449 7.449 0 0 0 0-14.898zm0 2.009c3.005 0 5.44 2.435 5.44 5.44s-2.435 5.44-5.44 5.44-5.44-2.435-5.44-5.44 2.435-5.44 5.44-5.44z' fill='%236001D2'/%3E%3C/svg%3E" },
  { id: "imap", name: "Custom IMAP", icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath d='M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z' fill='%23757575'/%3E%3C/svg%3E" }
];

// Folder types
type Folder = "inbox" | "sent" | "drafts" | "trash" | "starred";

const EmailPage = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State variables
  const [accounts, setAccounts] = useState(mockEmailAccounts);
  const [emails, setEmails] = useState(mockEmails);
  const [selectedAccountId, setSelectedAccountId] = useState(accounts.length > 0 ? accounts[0].id : null);
  const [selectedFolder, setSelectedFolder] = useState<Folder>("inbox");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [newAccountForm, setNewAccountForm] = useState({
    name: "",
    email: "",
    password: "",
    provider: "gmail"
  });
  const [newEmailForm, setNewEmailForm] = useState({
    to: "",
    subject: "",
    body: ""
  });
  
  // Get selected account
  const selectedAccount = accounts.find(account => account.id === selectedAccountId) || null;
  
  // Filter emails based on selected account, folder, and search term
  const filteredEmails = emails.filter(email => {
    const matchesAccount = email.accountId === selectedAccountId;
    const matchesFolder = 
      selectedFolder === "starred" ? email.starred : email.folder === selectedFolder;
    const matchesSearch = searchTerm 
      ? email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.from.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.body.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    return matchesAccount && matchesFolder && matchesSearch;
  });
  
  // Get selected email details
  const emailDetail = selectedEmail !== null
    ? emails.find(email => email.id === selectedEmail)
    : null;
  
  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString(undefined, { weekday: 'short' });
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };
  
  // Handle marking email as read/unread
  const toggleRead = (emailId: number) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, read: !email.read } : email
    ));
  };
  
  // Handle starring/unstarring email
  const toggleStar = (emailId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
  };
  
  // Handle deleting email
  const deleteEmail = (emailId: number) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, folder: "trash" } : email
    ));
    
    if (selectedEmail === emailId) {
      setSelectedEmail(null);
    }
    
    toast.success(translate('email.movedToTrash') || "Email moved to trash");
  };
  
  // Add new account
  const addAccount = () => {
    // In a real app, this would connect to the email provider
    const newAccount = {
      id: Date.now(),
      name: newAccountForm.name,
      email: newAccountForm.email,
      provider: newAccountForm.provider,
      logo: emailProviders.find(provider => provider.id === newAccountForm.provider)?.icon || ""
    };
    
    setAccounts([...accounts, newAccount]);
    setSelectedAccountId(newAccount.id);
    setNewAccountForm({ name: "", email: "", password: "", provider: "gmail" });
    toast.success(translate('email.accountAdded') || "Email account added");
  };
  
  // Send new email
  const sendEmail = () => {
    if (!selectedAccountId) return;
    
    const newEmail = {
      id: Date.now(),
      accountId: selectedAccountId,
      from: {
        name: "Me",
        email: accounts.find(account => account.id === selectedAccountId)?.email || ""
      },
      to: newEmailForm.to,
      subject: newEmailForm.subject,
      body: newEmailForm.body,
      date: new Date(),
      read: true,
      starred: false,
      folder: "sent" as Folder
    };
    
    setEmails([...emails, newEmail]);
    setNewEmailForm({ to: "", subject: "", body: "" });
    toast.success(translate('email.emailSent') || "Email sent");
  };
  
  // Calculate unread count
  const getUnreadCount = (folder: Folder) => {
    return emails.filter(email => 
      email.accountId === selectedAccountId && 
      email.folder === folder && 
      !email.read
    ).length;
  };
  
  // If no accounts are set up yet
  if (accounts.length === 0) {
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
          <h1 className="text-xl font-bold">{translate('email.title') || "Email"}</h1>
        </div>
        
        {/* Welcome Screen */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay">
          <div className="max-w-md text-center">
            <Mail className="h-16 w-16 mx-auto mb-6 text-navmax-accent" />
            
            <h2 className="text-2xl font-bold mb-4">
              {translate('email.welcome') || "Welcome to NAVMAX Mail"}
            </h2>
            
            <p className="mb-8 text-muted-foreground">
              {translate('email.welcomeDesc') || "Connect your email accounts to browse, read, and send emails directly from NAVMAX."}
            </p>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-navmax-accent hover:bg-navmax-accent/80">
                  <Plus className="mr-2 h-4 w-4" />
                  {translate('email.addAccount') || "Add Email Account"}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-navmax-muted border-navmax-light">
                <DialogHeader>
                  <DialogTitle>{translate('email.addAccount') || "Add Email Account"}</DialogTitle>
                  <DialogDescription>
                    {translate('email.addAccountDesc') || "Connect your email account to NAVMAX."}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  {/* Provider Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {translate('email.provider') || "Email Provider"}
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {emailProviders.map(provider => (
                        <Button
                          key={provider.id}
                          type="button"
                          variant={newAccountForm.provider === provider.id ? "default" : "outline"}
                          className={newAccountForm.provider === provider.id 
                            ? "bg-navmax-accent hover:bg-navmax-accent/80" 
                            : "border-navmax-light"
                          }
                          onClick={() => setNewAccountForm({...newAccountForm, provider: provider.id})}
                        >
                          <img 
                            src={provider.icon} 
                            alt={provider.name} 
                            className="w-5 h-5 mr-2" 
                          />
                          {provider.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Account Name */}
                  <div className="space-y-2">
                    <label htmlFor="account-name" className="text-sm font-medium">
                      {translate('email.accountName') || "Account Name"}
                    </label>
                    <Input 
                      id="account-name" 
                      value={newAccountForm.name} 
                      onChange={e => setNewAccountForm({...newAccountForm, name: e.target.value})}
                      placeholder={translate('email.accountNamePlaceholder') || "Work, Personal, etc."}
                      className="browser-input"
                    />
                  </div>
                  
                  {/* Email Address */}
                  <div className="space-y-2">
                    <label htmlFor="email-address" className="text-sm font-medium">
                      {translate('email.emailAddress') || "Email Address"}
                    </label>
                    <Input 
                      id="email-address" 
                      type="email"
                      value={newAccountForm.email} 
                      onChange={e => setNewAccountForm({...newAccountForm, email: e.target.value})}
                      placeholder="you@example.com"
                      className="browser-input"
                    />
                  </div>
                  
                  {/* Password */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      {translate('email.password') || "Password"}
                    </label>
                    <Input 
                      id="password" 
                      type="password"
                      value={newAccountForm.password} 
                      onChange={e => setNewAccountForm({...newAccountForm, password: e.target.value})}
                      placeholder="••••••••"
                      className="browser-input"
                    />
                    <p className="text-xs text-muted-foreground">
                      {translate('email.passwordDesc') || "Your password is securely stored and encrypted."}
                    </p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={addAccount}
                    className="bg-navmax-accent hover:bg-navmax-accent/80"
                    disabled={!newAccountForm.name || !newAccountForm.email || !newAccountForm.password}
                  >
                    {translate('email.connect') || "Connect Account"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-4 py-2 bg-navmax border-t border-navmax-light flex justify-end items-center">
          <div className="text-xs text-muted-foreground">
            <span>{translate('languageSettings.powered') || "Powered by"} </span>
            <span className="font-bold">agênciaMAX</span>
          </div>
        </div>
      </div>
    );
  }
  
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
        <h1 className="text-xl font-bold">{translate('email.title') || "Mail"}</h1>
        
        {/* Email account dropdown */}
        {accounts.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-4">
                <div className="flex items-center">
                  {selectedAccount && (
                    <>
                      <img 
                        src={selectedAccount.logo} 
                        alt={selectedAccount.name} 
                        className="w-5 h-5 mr-2" 
                      />
                      <span className="max-w-[100px] truncate">{selectedAccount.name}</span>
                      <ChevronDown className="ml-1 w-4 h-4" />
                    </>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-navmax-muted border-navmax-light">
              <DropdownMenuLabel>{translate('email.accounts') || "Your Accounts"}</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-navmax-light" />
              
              {accounts.map((account) => (
                <DropdownMenuItem 
                  key={account.id} 
                  onClick={() => setSelectedAccountId(account.id)}
                  className={selectedAccountId === account.id 
                    ? "bg-navmax-accent/10 text-navmax-accent" 
                    : "hover:bg-navmax/50"
                  }
                >
                  <div className="flex items-center">
                    <img 
                      src={account.logo} 
                      alt={account.name} 
                      className="w-5 h-5 mr-2" 
                    />
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-xs text-muted-foreground">{account.email}</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator className="bg-navmax-light" />
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Plus className="mr-2 w-4 h-4" />
                    {translate('email.addAccount') || "Add Account"}
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  {/* Account form would go here (reused from welcome screen) */}
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" className="nav-button">
            <RefreshCw size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="nav-button">
            <Settings size={18} />
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex bg-navmax overflow-hidden">
        {/* Sidebar */}
        <div className="bg-navmax-muted border-r border-navmax-light w-64 flex-shrink-0 flex flex-col">
          {/* New Email Button */}
          <div className="p-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-navmax-accent hover:bg-navmax-accent/80">
                  <Plus className="mr-2 w-4 h-4" />
                  {translate('email.compose') || "Compose"}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-navmax-muted border-navmax-light max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{translate('email.newEmail') || "New Email"}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="email-to" className="text-sm font-medium">
                      {translate('email.to') || "To"}
                    </label>
                    <Input 
                      id="email-to" 
                      value={newEmailForm.to} 
                      onChange={e => setNewEmailForm({...newEmailForm, to: e.target.value})}
                      placeholder="recipient@example.com"
                      className="browser-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email-subject" className="text-sm font-medium">
                      {translate('email.subject') || "Subject"}
                    </label>
                    <Input 
                      id="email-subject" 
                      value={newEmailForm.subject} 
                      onChange={e => setNewEmailForm({...newEmailForm, subject: e.target.value})}
                      placeholder={translate('email.subjectPlaceholder') || "Enter subject"}
                      className="browser-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email-body" className="text-sm font-medium">
                      {translate('email.message') || "Message"}
                    </label>
                    <textarea 
                      id="email-body" 
                      value={newEmailForm.body} 
                      onChange={e => setNewEmailForm({...newEmailForm, body: e.target.value})}
                      placeholder={translate('email.messagePlaceholder') || "Write your message here..."}
                      className="w-full h-64 px-4 py-2 rounded-xl bg-navmax text-navmax-foreground border border-navmax-light focus:outline-none focus:ring-1 focus:ring-navmax-accent resize-none"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={sendEmail}
                    className="bg-navmax-accent hover:bg-navmax-accent/80"
                    disabled={!newEmailForm.to || !newEmailForm.subject}
                  >
                    {translate('email.send') || "Send Email"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Folders */}
          <div className="p-2 space-y-1">
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${selectedFolder === "inbox" ? "bg-navmax-accent/10 text-navmax-accent" : ""}`}
              onClick={() => setSelectedFolder("inbox")}
            >
              <Inbox className="mr-2 w-4 h-4" />
              <span>{translate('email.inbox') || "Inbox"}</span>
              {getUnreadCount("inbox") > 0 && (
                <span className="ml-auto bg-navmax-accent text-white text-xs px-2 py-0.5 rounded-full">
                  {getUnreadCount("inbox")}
                </span>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${selectedFolder === "starred" ? "bg-navmax-accent/10 text-navmax-accent" : ""}`}
              onClick={() => setSelectedFolder("starred")}
            >
              <Star className="mr-2 w-4 h-4" />
              <span>{translate('email.starred') || "Starred"}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${selectedFolder === "sent" ? "bg-navmax-accent/10 text-navmax-accent" : ""}`}
              onClick={() => setSelectedFolder("sent")}
            >
              <Send className="mr-2 w-4 h-4" />
              <span>{translate('email.sent') || "Sent"}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${selectedFolder === "drafts" ? "bg-navmax-accent/10 text-navmax-accent" : ""}`}
              onClick={() => setSelectedFolder("drafts")}
            >
              <File className="mr-2 w-4 h-4" />
              <span>{translate('email.drafts') || "Drafts"}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${selectedFolder === "trash" ? "bg-navmax-accent/10 text-navmax-accent" : ""}`}
              onClick={() => setSelectedFolder("trash")}
            >
              <Trash2 className="mr-2 w-4 h-4" />
              <span>{translate('email.trash') || "Trash"}</span>
            </Button>
          </div>
        </div>
        
        {/* Email List and Detail View */}
        <div className="flex-1 flex flex-col">
          {/* Search Bar */}
          <div className="p-3 bg-navmax border-b border-navmax-light">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                type="search"
                placeholder={translate('email.searchPlaceholder') || "Search emails..."}
                className="pl-10 browser-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6" 
                  onClick={() => setSearchTerm("")}
                >
                  <X size={14} />
                </Button>
              )}
            </div>
          </div>
          
          {/* Email Content Area */}
          <div className="flex-1 flex bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay overflow-hidden">
            {/* Email List */}
            <div className={`border-r border-navmax-light ${selectedEmail ? "w-1/3" : "w-full"} overflow-y-auto`}>
              {/* Email List Header */}
              <div className="p-3 border-b border-navmax-light flex items-center justify-between">
                <h2 className="font-bold">
                  {translate(`email.${selectedFolder}`) || selectedFolder.charAt(0).toUpperCase() + selectedFolder.slice(1)}
                </h2>
                <Button variant="ghost" size="sm" className="nav-button">
                  <Filter size={16} />
                </Button>
              </div>
              
              {/* Email Items */}
              {filteredEmails.length > 0 ? (
                <div>
                  {filteredEmails.map((email) => (
                    <div 
                      key={email.id} 
                      className={`
                        border-b border-navmax-light p-3 cursor-pointer
                        ${!email.read ? "bg-navmax-muted" : ""}
                        ${selectedEmail === email.id ? "bg-navmax-accent/10 border-l-2 border-l-navmax-accent" : ""}
                        hover:bg-navmax-muted/50
                      `}
                      onClick={() => {
                        setSelectedEmail(email.id);
                        if (!email.read) {
                          toggleRead(email.id);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <button 
                            className="mr-2 text-muted-foreground hover:text-navmax-accent"
                            onClick={(e) => toggleStar(email.id, e)}
                          >
                            <Star className={`w-4 h-4 ${email.starred ? "fill-navmax-accent text-navmax-accent" : "fill-transparent"}`} />
                          </button>
                          <span className={`font-medium ${!email.read ? "font-bold" : ""}`}>
                            {email.from.name}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(email.date)}
                        </span>
                      </div>
                      
                      <h3 className={`text-sm truncate ${!email.read ? "font-semibold" : ""}`}>
                        {email.subject}
                      </h3>
                      
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {email.body}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
                  <Mail className="h-12 w-12 text-navmax-light mb-4" />
                  <h3 className="font-bold mb-2">
                    {searchTerm
                      ? translate('email.noSearchResults') || "No emails match your search"
                      : translate('email.noEmails') || "No emails in this folder"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm
                      ? translate('email.tryDifferentSearch') || "Try a different search term"
                      : ""}
                  </p>
                </div>
              )}
            </div>
            
            {/* Email Detail */}
            {selectedEmail && emailDetail && (
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {/* Email Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">{emailDetail.subject}</h2>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => toggleStar(emailDetail.id, new MouseEvent('click') as any)}
                        >
                          <Star className={`w-4 h-4 ${emailDetail.starred ? "fill-navmax-accent text-navmax-accent" : "fill-transparent"}`} />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:text-red-500"
                          onClick={() => deleteEmail(emailDetail.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-navmax-muted flex items-center justify-center text-lg font-bold">
                        {emailDetail.from.name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{emailDetail.from.name}</h3>
                          <span className="text-xs text-muted-foreground">
                            &lt;{emailDetail.from.email}&gt;
                          </span>
                        </div>
                        
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>To: {emailDetail.to}</span>
                          <span className="mx-2">•</span>
                          <span>
                            {emailDetail.date.toLocaleDateString()} {emailDetail.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Email Body */}
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{emailDetail.body}</p>
                  </div>
                  
                  {/* Reply Section */}
                  <div className="mt-8 pt-6 border-t border-navmax-light">
                    <div className="bg-navmax-muted rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        {translate('email.replyHere') || "Click here to reply..."}
                      </p>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" className="border-navmax-light">
                          {translate('email.reply') || "Reply"}
                        </Button>
                        <Button variant="outline" className="border-navmax-light">
                          {translate('email.forward') || "Forward"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2 bg-navmax border-t border-navmax-light flex justify-end items-center">
        <div className="text-xs text-muted-foreground">
          <span>{translate('languageSettings.powered') || "Powered by"} </span>
          <span className="font-bold">agênciaMAX</span>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
