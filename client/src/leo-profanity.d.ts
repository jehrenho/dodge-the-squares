declare module 'leo-profanity' {
  const leoProfanity: {
    clean: (input: string) => string;
    check: (input: string) => boolean;
    loadDictionary: (lang: string) => void;
    add: (words: string[]) => void;
    remove: (words: string[]) => void;
  };
  export default leoProfanity;
}