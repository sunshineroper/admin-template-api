import http from 'node:http'
import { URLSearchParams } from 'node:url'
import { jwt, logger } from 'koa-cms-lib'
import { OPEN, WebSocketServer } from 'ws'
import { get, set } from 'lodash'

const USER_KEY = Symbol('user')
export default class WebSocket {
  constructor(app) {
    this.app = app
    this.wss = null
    this.sessions = new Set()
  }

  init() {
    const server = http.createServer(this.app.callback())
    this.wss = new WebSocketServer({ noServer: true })
    server.on('upgrade', this.interceptors.bind(this))
    this.app.context.websocket = this
    this.wss.conncation = () => {
      this.wss.on('message', (data) => {
        logger.info(`Received message ${data} from user`)
      })
    }
    return server
  }

  interceptors(request, socket, head) {
    const url = request.url.substring(request.url, request.url.indexOf('?'))
    if (url === '/ws/message') {
      const params = new URLSearchParams(
        request.url.slice(request.url.indexOf('?')),
      )
      const token = params.get('token')
      try {
        const { identity } = jwt.verifyToken(token)
        this.wss.handleUpgrade(request, socket, head, (ws) => {
          socket.on('error', (err) => {
            console.error(err)
          })
          ws.send('sunshine')
          set(ws, USER_KEY, identity)
          this.sessions.add(ws)
          this.wss.emit('connection', ws, request)
        })
      }
      catch (error) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
        logger.error(error)
        // socket.destory()
      }
    }
    else {
      socket.destroy()
    }
  }

  sendMessage(message) {
    for (const session of this.sessions) {
      if (session.readyState !== OPEN)
        continue
      get(session, USER_KEY)
      session.send('恭喜你回帖成功')
    }
  }

  send(id, message = '您有一条新的消息') {
    for (const session of this.sessions) {
      if (get(session, USER_KEY) === id) {
        if (session.readyState === OPEN)
          session.send(message)
      }
    }
  }
}
