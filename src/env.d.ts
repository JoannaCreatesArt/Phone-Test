interface Window {
  api: {
    platform: string
    callClaude: (apiKey: string, prompt: string, system?: string) => Promise<string>
  }
}
