
import { Server } from 'socket.io'
import { addSong } from '../songs.service'

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      socket.on('join-room', room => {
        socket.join(room)
      })

      socket.on('lyric-change', room => {
        socket.to(room).emit('lyric-updated')
      })

      socket.on('add-song', async (songData) => {
        try {
          const newSong = await addSong(songData.title, songData.artist, songData.audioUrl, songData.userId)
          socket.broadcast.emit('update-input', newSong)
        } catch (error) {
          console.error('Error adding song:', error)
        }
      })
    })
  }
  res.end()
}

export default SocketHandler
