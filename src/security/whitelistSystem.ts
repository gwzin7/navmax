
// List of allowed domains
export const whitelistedDomains: string[] = [
  "google.com",
  "github.com",
  "agenciamax.com", // Replace with actual domain when available
  "localhost",
  "127.0.0.1",
  "example.com",
  "mozilla.org",
  "wikipedia.org",
  "microsoft.com",
  "apple.com"
];

export const isUrlWhitelisted = (url: string): boolean => {
  if (!url) return false;
  
  try {
    // Handle URL without protocol
    let urlObj: URL;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      urlObj = new URL(url);
    } else {
      urlObj = new URL(`https://${url}`);
    }
    
    // Extract domain from hostname
    const domain = urlObj.hostname;
    
    // Check if domain or any parent domain is whitelisted
    return whitelistedDomains.some(whitelistedDomain => 
      domain === whitelistedDomain || 
      domain.endsWith(`.${whitelistedDomain}`)
    );
  } catch (e) {
    console.error("Invalid URL:", url);
    return false;
  }
};

export const logNavigation = (url: string, user: string | null): void => {
  console.log(`Navigation: ${user || 'Anonymous'} navigated to ${url} at ${new Date().toLocaleString()}`);
};

export const getFormattedUrl = (url: string): string => {
  if (!url) return '';
  
  // If URL doesn't start with protocol, add https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  
  return url;
};
