export function getLocale(): 'ja' | 'en' {
  const lang = process.env.LANG || process.env.LC_ALL || process.env.LC_MESSAGES || '';
  
  if (lang.toLowerCase().startsWith('ja')) {
    return 'ja';
  }
  
  return 'en';
}

export function isJapanese(): boolean {
  return getLocale() === 'ja';
}