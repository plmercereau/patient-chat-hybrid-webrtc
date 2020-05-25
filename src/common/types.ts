export interface PeerServer {
  name?: string
  host: string
  path?: string
  port: number
  secure: boolean
  debug?: number
}

export interface Service {
  domain: string
  type: string
  name: string
  port: number
  hostname: string
  ipv4Addresses: string[]
  ipv6Addresses: string[]
  txtRecord: Record<string, string>
}
