
import React, { useState } from "react";
import { FileSearch, FilePlus, FileMinus, Search, Trash, Clock, Calendar, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/language/LanguageContext";

interface OfflinePage {
  id: string;
  title: string;
  url: string;
  date: string;
  favicon?: string;
  thumbnail?: string;
  size: string;
}

const OfflinePagesPage = () => {
  const { translate } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pages, setPages] = useState<OfflinePage[]>([
    {
      id: "1",
      title: "How to Build a Modern Web Browser",
      url: "https://tech.example.com/browser-architecture",
      date: "2023-05-15",
      favicon: "/placeholder.svg",
      thumbnail: "/placeholder.svg",
      size: "1.2 MB"
    },
    {
      id: "2",
      title: "The Future of UI Design",
      url: "https://design.example.com/future-ui-trends",
      date: "2023-05-14",
      favicon: "/placeholder.svg",
      thumbnail: "/placeholder.svg",
      size: "0.8 MB"
    },
    {
      id: "3",
      title: "Maximizing Productivity with NAVMAX Browser",
      url: "https://navmax.example.com/productivity-tips",
      date: "2023-05-13",
      favicon: "/placeholder.svg",
      thumbnail: "/placeholder.svg",
      size: "1.5 MB"
    },
    {
      id: "4",
      title: "Top 10 Browser Extensions for Designers",
      url: "https://design.example.com/browser-extensions",
      date: "2023-05-12",
      favicon: "/placeholder.svg",
      thumbnail: "/placeholder.svg",
      size: "0.9 MB"
    }
  ]);

  const deletePage = (id: string) => {
    setPages(pages.filter(page => page.id !== id));
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-navmax bg-paper-texture bg-opacity-10 bg-blend-overlay p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold mr-auto">{translate("offlinePages.title")}</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-navmax-foreground/50" />
            </div>
            <Input
              placeholder={translate("offlinePages.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          
          <div className="flex border border-navmax-light rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-none rounded-l-md ${viewMode === 'grid' ? 'bg-navmax-light' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-none rounded-r-md ${viewMode === 'list' ? 'bg-navmax-light' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </Button>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">
                <FilePlus size={16} className="mr-2" />
                {translate("offlinePages.saveNew")}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-navmax">
              <DialogHeader>
                <DialogTitle>{translate("offlinePages.savePage")}</DialogTitle>
              </DialogHeader>
              <div className="p-4 bg-navmax-muted rounded-lg border border-navmax-light">
                <p className="text-sm">{translate("offlinePages.savePageDescription")}</p>
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1">{translate("offlinePages.saveCurrentPage")}</Button>
                  <Button variant="outline" className="flex-1">{translate("offlinePages.enterUrl")}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="mb-6">
          <TabsTrigger value="all">{translate("offlinePages.allPages")}</TabsTrigger>
          <TabsTrigger value="recent">{translate("offlinePages.recentlySaved")}</TabsTrigger>
          <TabsTrigger value="largest">{translate("offlinePages.largest")}</TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="all" className="mt-0 h-full">
            {filteredPages.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPages.map(page => (
                    <div
                      key={page.id}
                      className="group bg-navmax-muted rounded-xl overflow-hidden border border-navmax-light hover:border-navmax-accent transition-all"
                    >
                      <div className="relative h-40 bg-navmax-dark overflow-hidden">
                        <img
                          src={page.thumbnail}
                          alt={page.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-navmax-dark opacity-80" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center">
                          <img
                            src={page.favicon}
                            alt=""
                            className="h-5 w-5 rounded mr-2 bg-white p-0.5"
                          />
                          <h3 className="font-semibold text-sm line-clamp-1">{page.title}</h3>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-navmax bg-opacity-50 rounded-full text-navmax-accent"
                            onClick={() => deletePage(page.id)}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-navmax-foreground/70 truncate mb-1">{page.url}</p>
                        <div className="flex items-center justify-between text-xs text-navmax-foreground/50">
                          <div className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {page.date}
                          </div>
                          <div>{page.size}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPages.map(page => (
                    <div
                      key={page.id}
                      className="group flex items-center bg-navmax-muted rounded-xl p-3 border border-navmax-light hover:border-navmax-accent transition-all"
                    >
                      <div className="h-12 w-12 bg-navmax-dark rounded-md overflow-hidden mr-4 flex-shrink-0">
                        <img
                          src={page.thumbnail}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1">
                          <img
                            src={page.favicon}
                            alt=""
                            className="h-4 w-4 rounded mr-2 bg-white p-0.5"
                          />
                          <h3 className="font-semibold text-sm truncate">{page.title}</h3>
                        </div>
                        <p className="text-xs text-navmax-foreground/70 truncate">{page.url}</p>
                      </div>
                      <div className="flex flex-col items-end ml-4 text-xs text-navmax-foreground/50">
                        <div className="flex items-center mb-1">
                          <Calendar size={12} className="mr-1" />
                          {page.date}
                        </div>
                        <div>{page.size}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-2 text-navmax-accent opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deletePage(page.id)}
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-navmax-foreground/50">
                <FileSearch size={48} className="mb-4 opacity-50" />
                <p>{translate("offlinePages.noResults")}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="mt-0 h-full">
            {/* Similar content structure but filtered for recent pages */}
            <div className="h-full flex flex-col items-center justify-center text-navmax-foreground/50">
              <Clock size={48} className="mb-4 opacity-50" />
              <p>{translate("offlinePages.noRecentPages")}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="largest" className="mt-0 h-full">
            {/* Similar content structure but sorted by size */}
            <div className="h-full flex flex-col items-center justify-center text-navmax-foreground/50">
              <FileMinus size={48} className="mb-4 opacity-50" />
              <p>{translate("offlinePages.noLargePages")}</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="mt-6 text-xs text-navmax-foreground/50 absolute right-6 bottom-6">
        NAVMAX
      </div>
    </div>
  );
};

export default OfflinePagesPage;
