
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/language/LanguageContext";
import { 
  ArrowLeft,
  BookmarkPlus,
  FolderPlus,
  Search, 
  X,
  Edit2,
  Trash2,
  Folder,
  ChevronDown,
  ChevronRight,
  Globe
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";

// Mock bookmark data
const mockBookmarkFolders = [
  {
    id: 1,
    name: "Work",
    bookmarks: [
      { id: 101, title: "Google Docs", url: "https://docs.google.com", favicon: "https://www.google.com/favicon.ico" },
      { id: 102, title: "Slack", url: "https://slack.com", favicon: "https://slack.com/favicon.ico" },
      { id: 103, title: "Trello", url: "https://trello.com", favicon: "https://trello.com/favicon.ico" }
    ]
  },
  {
    id: 2,
    name: "Social Media",
    bookmarks: [
      { id: 201, title: "Twitter", url: "https://twitter.com", favicon: "https://twitter.com/favicon.ico" },
      { id: 202, title: "Facebook", url: "https://facebook.com", favicon: "https://facebook.com/favicon.ico" },
      { id: 203, title: "LinkedIn", url: "https://linkedin.com", favicon: "https://linkedin.com/favicon.ico" }
    ]
  },
  {
    id: 3,
    name: "News",
    bookmarks: [
      { id: 301, title: "CNN", url: "https://cnn.com", favicon: "https://cnn.com/favicon.ico" },
      { id: 302, title: "BBC", url: "https://bbc.com", favicon: "https://bbc.com/favicon.ico" },
      { id: 303, title: "The New York Times", url: "https://nytimes.com", favicon: "https://nytimes.com/favicon.ico" }
    ]
  }
];

type Bookmark = {
  id: number;
  title: string;
  url: string;
  favicon: string;
};

type BookmarkFolder = {
  id: number;
  name: string;
  bookmarks: Bookmark[];
};

const BookmarksPage = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [folders, setFolders] = useState<BookmarkFolder[]>(mockBookmarkFolders);
  const [openFolders, setOpenFolders] = useState<number[]>([1, 2, 3]); // Default open all folders
  const [editingFolder, setEditingFolder] = useState<BookmarkFolder | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newBookmark, setNewBookmark] = useState<{title: string, url: string, folderId: number | null}>({
    title: "",
    url: "",
    folderId: null
  });
  
  // Toggle folder open/closed state
  const toggleFolder = (folderId: number) => {
    setOpenFolders(prev => 
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };
  
  // Add new folder
  const addFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: BookmarkFolder = {
      id: Date.now(),
      name: newFolderName,
      bookmarks: []
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setOpenFolders([...openFolders, newFolder.id]);
    toast.success(translate('bookmarks.folderCreated') || "Folder created");
  };
  
  // Update folder name
  const updateFolderName = () => {
    if (!editingFolder || !newFolderName.trim()) return;
    
    setFolders(folders.map(folder => 
      folder.id === editingFolder.id 
        ? { ...folder, name: newFolderName }
        : folder
    ));
    
    setEditingFolder(null);
    setNewFolderName("");
    toast.success(translate('bookmarks.folderRenamed') || "Folder renamed");
  };
  
  // Delete folder
  const deleteFolder = (folderId: number) => {
    setFolders(folders.filter(folder => folder.id !== folderId));
    setOpenFolders(openFolders.filter(id => id !== folderId));
    toast.success(translate('bookmarks.folderDeleted') || "Folder deleted");
  };
  
  // Add new bookmark
  const addBookmark = () => {
    if (!newBookmark.title.trim() || !newBookmark.url.trim() || newBookmark.folderId === null) return;
    
    // Add http:// if missing
    let url = newBookmark.url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    const newBookmarkItem: Bookmark = {
      id: Date.now(),
      title: newBookmark.title,
      url,
      favicon: `https://www.google.com/s2/favicons?domain=${url}`
    };
    
    setFolders(folders.map(folder => 
      folder.id === newBookmark.folderId
        ? { ...folder, bookmarks: [...folder.bookmarks, newBookmarkItem] }
        : folder
    ));
    
    setNewBookmark({ title: "", url: "", folderId: null });
    toast.success(translate('bookmarks.bookmarkAdded') || "Bookmark added");
  };
  
  // Delete bookmark
  const deleteBookmark = (folderId: number, bookmarkId: number) => {
    setFolders(folders.map(folder => 
      folder.id === folderId
        ? { 
            ...folder, 
            bookmarks: folder.bookmarks.filter(bookmark => bookmark.id !== bookmarkId)
          }
        : folder
    ));
    toast.success(translate('bookmarks.bookmarkDeleted') || "Bookmark deleted");
  };
  
  // Filter bookmarks based on search
  const filteredFolders = searchTerm
    ? folders.map(folder => ({
        ...folder,
        bookmarks: folder.bookmarks.filter(bookmark => 
          bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(folder => folder.bookmarks.length > 0)
    : folders;
  
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
        <h1 className="text-xl font-bold">{translate('bookmarks.title') || "Bookmarks"}</h1>
        
        <div className="ml-auto flex items-center gap-2">
          {/* Add Bookmark Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="nav-button">
                <BookmarkPlus size={18} className="text-navmax-accent" />
                <span className="hidden sm:inline ml-1">{translate('bookmarks.addBookmark') || "Add Bookmark"}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-navmax-muted border-navmax-light">
              <DialogHeader>
                <DialogTitle>{translate('bookmarks.addBookmark') || "Add Bookmark"}</DialogTitle>
                <DialogDescription>
                  {translate('bookmarks.addBookmarkDesc') || "Enter the details for your new bookmark."}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    {translate('bookmarks.title') || "Title"}
                  </label>
                  <Input 
                    id="title" 
                    value={newBookmark.title} 
                    onChange={e => setNewBookmark({...newBookmark, title: e.target.value})}
                    placeholder={translate('bookmarks.titlePlaceholder') || "My Favorite Site"}
                    className="browser-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="url" className="text-sm font-medium">
                    {translate('bookmarks.url') || "URL"}
                  </label>
                  <Input 
                    id="url" 
                    value={newBookmark.url} 
                    onChange={e => setNewBookmark({...newBookmark, url: e.target.value})}
                    placeholder="https://example.com"
                    className="browser-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="folder" className="text-sm font-medium">
                    {translate('bookmarks.folder') || "Folder"}
                  </label>
                  <select 
                    id="folder"
                    value={newBookmark.folderId || ""}
                    onChange={e => setNewBookmark({...newBookmark, folderId: Number(e.target.value)})}
                    className="w-full px-4 py-2 rounded-xl bg-navmax text-navmax-foreground border border-navmax-light focus:outline-none focus:ring-1 focus:ring-navmax-accent"
                  >
                    <option value="">{translate('bookmarks.selectFolder') || "Select a folder"}</option>
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={addBookmark}
                  className="bg-navmax-accent hover:bg-navmax-accent/80"
                  disabled={!newBookmark.title || !newBookmark.url || !newBookmark.folderId}
                >
                  {translate('bookmarks.save') || "Save Bookmark"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Add Folder Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="nav-button">
                <FolderPlus size={18} className="text-navmax-accent" />
                <span className="hidden sm:inline ml-1">{translate('bookmarks.addFolder') || "Add Folder"}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-navmax-muted border-navmax-light">
              <DialogHeader>
                <DialogTitle>{translate('bookmarks.addFolder') || "Add Folder"}</DialogTitle>
                <DialogDescription>
                  {translate('bookmarks.addFolderDesc') || "Create a new folder to organize your bookmarks."}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="folder-name" className="text-sm font-medium">
                    {translate('bookmarks.folderName') || "Folder Name"}
                  </label>
                  <Input 
                    id="folder-name" 
                    value={newFolderName} 
                    onChange={e => setNewFolderName(e.target.value)}
                    placeholder={translate('bookmarks.folderNamePlaceholder') || "My Folder"}
                    className="browser-input"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={addFolder}
                  className="bg-navmax-accent hover:bg-navmax-accent/80"
                  disabled={!newFolderName}
                >
                  {translate('bookmarks.createFolder') || "Create Folder"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-navmax">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="search"
            placeholder={translate('bookmarks.searchPlaceholder') || "Search bookmarks..."}
            className="pl-10 browser-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8" 
              onClick={() => setSearchTerm("")}
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Bookmarks Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay">
        {filteredFolders.length > 0 ? (
          <div className="space-y-6">
            {filteredFolders.map((folder) => (
              <div key={folder.id} className="border border-navmax-light rounded-xl overflow-hidden">
                <Collapsible 
                  open={openFolders.includes(folder.id)} 
                  onOpenChange={() => toggleFolder(folder.id)}
                  className="w-full"
                >
                  <div className="flex items-center justify-between p-4 bg-navmax-muted border-b border-navmax-light">
                    <div className="flex items-center gap-2">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                          {openFolders.includes(folder.id) ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      
                      <Folder size={18} className="text-navmax-accent" />
                      <h2 className="font-bold">{folder.name}</h2>
                      <span className="text-xs text-muted-foreground">
                        ({folder.bookmarks.length})
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {/* Edit Folder Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingFolder(folder);
                              setNewFolderName(folder.name);
                            }}
                          >
                            <Edit2 size={14} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-navmax-muted border-navmax-light">
                          <DialogHeader>
                            <DialogTitle>{translate('bookmarks.renameFolder') || "Rename Folder"}</DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label htmlFor="edit-folder-name" className="text-sm font-medium">
                                {translate('bookmarks.folderName') || "Folder Name"}
                              </label>
                              <Input 
                                id="edit-folder-name" 
                                value={newFolderName} 
                                onChange={e => setNewFolderName(e.target.value)}
                                className="browser-input"
                              />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button 
                              type="submit" 
                              onClick={updateFolderName}
                              className="bg-navmax-accent hover:bg-navmax-accent/80"
                              disabled={!newFolderName}
                            >
                              {translate('bookmarks.save') || "Save"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      {/* Delete Folder Button */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:text-red-500"
                        onClick={() => deleteFolder(folder.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  <CollapsibleContent>
                    <div className="p-2">
                      {folder.bookmarks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {folder.bookmarks.map((bookmark) => (
                            <div 
                              key={bookmark.id} 
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-navmax-muted transition-colors duration-200"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-navmax-light flex items-center justify-center overflow-hidden">
                                  {bookmark.favicon ? (
                                    <img 
                                      src={bookmark.favicon} 
                                      alt="" 
                                      className="h-full w-full"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999999' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E";
                                      }}
                                    />
                                  ) : (
                                    <Globe size={14} className="text-muted-foreground" />
                                  )}
                                </div>
                                
                                <div className="overflow-hidden">
                                  <h3 className="font-medium text-sm truncate">{bookmark.title}</h3>
                                  <p className="text-xs text-muted-foreground truncate">{bookmark.url}</p>
                                </div>
                              </div>
                              
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 flex-shrink-0 hover:text-red-500"
                                onClick={() => deleteBookmark(folder.id, bookmark.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-6 text-center text-muted-foreground">
                          <p>{translate('bookmarks.emptyFolder') || "This folder is empty"}</p>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <BookmarkPlus className="h-16 w-16 text-navmax-light mb-4" />
            <h3 className="text-xl font-bold mb-2">
              {searchTerm
                ? translate('bookmarks.noResults') || "No bookmarks match your search"
                : translate('bookmarks.noBookmarks') || "No bookmarks yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? translate('bookmarks.tryDifferentSearch') || "Try a different search term"
                : translate('bookmarks.startAddingBookmarks') || "Start adding your favorite websites"}
            </p>
            
            {!searchTerm && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-navmax-accent hover:bg-navmax-accent/80">
                    <BookmarkPlus size={18} className="mr-2" />
                    {translate('bookmarks.addBookmark') || "Add Your First Bookmark"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-navmax-muted border-navmax-light">
                  <DialogHeader>
                    <DialogTitle>{translate('bookmarks.addBookmark') || "Add Bookmark"}</DialogTitle>
                  </DialogHeader>
                  
                  {/* Add bookmark form content would go here */}
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
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

export default BookmarksPage;
