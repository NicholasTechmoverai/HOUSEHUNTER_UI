import { io, type Socket } from 'socket.io-client'
import { useAppConfig } from '#imports'

const sockets: Record<string, Socket> = {}

export function useSocket(namespace: string) {
  // ✅ explicit client guard
  if (!process.client) {
    throw new Error('useSocket() can only be used on the client')
  }

  if (!sockets[namespace]) {
    const { site } = useAppConfig()

    sockets[namespace] = io(
      `${site.apiBase}/${namespace}`,
      {
        path: '/ws/socket.io',
        transports: ['websocket'],
        withCredentials: true
      }
    )
  }

  return sockets[namespace]
}
