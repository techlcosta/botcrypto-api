declare module 'http' {
  export interface IncomingMessage {
    userId: string
  }
}
