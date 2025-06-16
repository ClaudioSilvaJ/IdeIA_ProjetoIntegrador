import { useEffect, useState, useCallback, useRef } from 'react'
import MessageBox from '../../components/MessageBox/MessageBox'
import MessageInput from '../../components/MessageInput/MessageInput'
import MessageServices from '../../services/MessageServices'
import { useWebSocket } from '../../hooks/useWebSocket'

function ChatView() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    MessageServices.getMessages()
      .then((response) => {
        const transformedMessages = response.messages.flatMap((msg) => {
          const userMessage = {
            message: msg.message,
            timestamp: msg.timestamp,
            user_id: msg.user_id || 'user',
          }

          const iaMessage = {
            message: msg.message_ia?.content || '',
            timestamp: msg.timestamp,
            user_id: 'IA',
          }

          return [userMessage, iaMessage]
        })

        setMessages(transformedMessages)
      })
      .catch((error) => {
        console.error('Error fetching messages:', error)
      })
  }, [])

  const handleSendMessage = async (text) => {
    const timestamp = new Date().toISOString()

    const userMessage = {
      message: text,
      timestamp,
      user_id: 'user',
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      await MessageServices.sendMessage(text)
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err)
      setIsLoading(false)
    }
  }

  const handleNewMessage = useCallback((msg) => {

    const iaMessage = {
      message: msg.message_ia.content,
      timestamp: msg.timestamp,
      user_id: 'IA',
    }

    setMessages((prev) => [...prev, iaMessage])
    setIsLoading(false)
  }, [])

  useWebSocket('ws/messages', handleNewMessage)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className="flex flex-col h-screen w-full items-center p-4 bg-gradient-to-t from-rose-950 to-orange-700">
      <img src="logo.png" alt="AI App" className="absolute top-10 left-1/2 transform -translate-x-1/2 object-cover"/>
      <div className="absolute top-8 right-8 border-2 border-white/50 hover:border-white/70 hover:bg-amber-600 rounded-full cursor-pointer w-16 p-4" onClick={() => window.history.back()}>
        <img src="voltar.png" alt="Voltar" style={{ filter: 'invert(1)' }} />
      </div>
      <div className="flex flex-col w-full md:max-w-[60vw] lg:max-w-[45vw] xl:max-w-[30vw] h-[90vh] pt-48">
        <div className="bg-white/80 backdrop-blur-lg shadow-[0px_0px_20px_5px_rgba(255,_255,_255,_0.05)] items-center flex-grow overflow-y-auto rounded-lg">
          {messages.map((message) => (
            <MessageBox key={`${message.timestamp}-${message.user_id}`} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <MessageInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}

export default ChatView
