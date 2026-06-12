import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  platform: process.platform,
  callClaude: (apiKey: string, prompt: string, system?: string) =>
    ipcRenderer.invoke('claude:message', { apiKey, prompt, system })
})
