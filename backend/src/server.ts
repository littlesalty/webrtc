import express, { Application } from "express"
import { Server as SocketIOServer } from "socket.io"
import { createServer, Server as HTTPServer } from "http"
import { mockRooms } from "./models/room"
import { socketHandler } from "./socket-handler"
import cors from "cors"
import { serverDatabase } from "./database"
import { ConfigFile as ConfigFile } from "."


// import { serverDatabase } from "./database"

export class Server {
  private httpServer: HTTPServer;
  private app: Application;
  private io: SocketIOServer;

  private readonly DEFAULT_PORT = 4200;

  constructor(private config: ConfigFile) {
    this.initialize()
    this.handleSocketConnection()
    this.handleRoutes()
  }

  private initialize(): void {
    this.app = express()
    this.configCors()
    if (!this.config.production) {
      this.app.use("/web", express.static("../frontend/dist/web"))
    }
    this.app.use("/pizza", express.static("/root/pizza-receipe/"))
    this.httpServer = createServer(this.app)
    this.io = new SocketIOServer(this.httpServer)
  }

  private configCors(): void {
    this.app.use(cors({
      origin: '*'
    }))
  }


  private handleRoutes(): void {

    this.app.get("/chat-history", (req, res) => {
      const messages = serverDatabase.readMessages()
      res.statusCode = 200
      res.contentType("application/json").send(messages)
    })

    this.app.get("/rooms", (req, res) => {
      res.send(mockRooms)
    })

    this.app.post("/room/:id/join", (req, res) => {
      res.statusCode = 200
      res.end()
    })

    this.app.get("*", (req, res) => {
      if(!req.url.includes('pizza')) {
        const host = req.header('host')
        const redirectTo = !this.config.production ? `http://${host}/web` : `https://${host}/web`
        res.redirect(redirectTo)
      }
    })
  }

  private handleSocketConnection(): void {

    this.io.on("connection", socket => {
      console.log("Socket connected.", socket.id, socket.handshake.time)
      socket.emit('sendMessage', serverDatabase.readMessages())
      socketHandler.add(socket)

      socket.on('sendMessage', chatMessage => {
        console.log("Topic - 'sendMessage'", chatMessage)
        serverDatabase.addMessage(chatMessage)
        for (const socket of socketHandler.activeSockets) {
          socket.emit('sendMessage', chatMessage)
        }
      })
    })


    this.io.on("disconnect", socket => {
      socketHandler.remove(socket)
      console.log("Socket disconnected.")
    })
  }


  public listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    )
  }
}
