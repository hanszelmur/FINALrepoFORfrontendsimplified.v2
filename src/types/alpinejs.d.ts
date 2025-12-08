declare module 'alpinejs' {
  interface Alpine {
    start(): void;
    data(name: string, callback: () => Record<string, unknown>): void;
  }

  const Alpine: Alpine;
  export default Alpine;
}
