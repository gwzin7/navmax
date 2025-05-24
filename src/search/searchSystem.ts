
export type SearchEngine = 'navmax' | 'google';

export interface SearchQuery {
  term: string;
  engine: SearchEngine;
  timestamp: Date;
  user: string | null;
}

// Navmax search URL generator
export const performNavmaxSearch = (term: string): string => {
  return `https://www.intellinax.com.br/search?q=${encodeURIComponent(term)}`;
};

// Google search URL generator
export const performGoogleSearch = (term: string): string => {
  return `https://www.google.com/search?q=${encodeURIComponent(term)}`;
};

// Log search query for analytics/history
export const logSearch = (query: SearchQuery): void => {
  console.log(`Search: ${query.user || 'Anonymous'} searched for "${query.term}" using ${query.engine} engine at ${query.timestamp.toLocaleString()}`);
};

// Generate search URL based on selected engine
export const generateSearchUrl = (term: string, engine: SearchEngine = 'navmax'): string => {
  return engine === 'navmax' ? performNavmaxSearch(term) : performGoogleSearch(term);
};
