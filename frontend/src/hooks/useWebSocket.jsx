import { useEffect, useRef } from 'react'
import { NetworkService } from '../services/NetworkServices'

export function useWebSocket(path, onMessage) {
  const socketRef = useRef(null)

  useEffect(() => {
    socketRef.current = NetworkService.createWebSocket(path)

    socketRef.current.onopen = () => {
      console.log('WebSocket conectado')
    }

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('Mensagem recebida via WebSocket:', data)
        onMessage(data)
      } catch (error) {
        console.error('Erro ao processar mensagem WebSocket:', error)
      }
    }

    socketRef.current.onerror = (error) => {
      console.error('WebSocket erro:', error)
    }

    socketRef.current.onclose = () => {
      console.log('WebSocket desconectado')
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [path, onMessage])

  return socketRef
}
