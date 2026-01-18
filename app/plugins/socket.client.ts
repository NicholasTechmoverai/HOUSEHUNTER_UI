export default defineNuxtPlugin(() => {
  const mainSocket = useSocket('main')
  const chatsSocket = useSocket('chats')

  mainSocket.on('connect', () => {
    console.log('✅ Main connected')
  })

  chatsSocket.on('message', (data) => {
    console.log('💬 Chat:', data)
  })
})
