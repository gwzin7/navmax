
/**
 * Theme toggle utility for IntelliMAX
 */

// Toggle between light and dark mode
export const toggleTheme = (): string => {
  // Check the current theme
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  // Toggle theme
  if (isDarkMode) {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('intellimax-theme', 'light');
    return 'light';
  } else {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    localStorage.setItem('intellimax-theme', 'dark');
    return 'dark';
  }
};

// Get the current theme
export const getCurrentTheme = (): string => {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

// Set the theme explicitly
export const setTheme = (theme: 'dark' | 'light'): void => {
  document.documentElement.classList.remove('dark', 'light');
  document.documentElement.classList.add(theme);
  localStorage.setItem('intellimax-theme', theme);
};

// Initialize theme based on user preference
export const initTheme = (): void => {
  const savedTheme = localStorage.getItem('intellimax-theme');
  
  if (savedTheme === 'light' || savedTheme === 'dark') {
    setTheme(savedTheme);
  } else {
    // Check system preference if no saved theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }
};
