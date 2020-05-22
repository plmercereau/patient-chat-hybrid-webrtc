export interface PeerServer {
  host: string
  port: number
  secure: boolean
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
