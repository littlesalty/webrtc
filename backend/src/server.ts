import express, { Application } from "express"
import { Server as SocketIOServer } from "socket.io"
import { createServer, Server as HTTPServer } from "http"
import { mockRooms } from "./models/room"
import { socketHandler } from "./socket-handler"
import cors from "cors"
import { serverDatabase } from "./database"

export class Server {
  private httpServer: HTTPServer;
  private app: Application;
  private io: SocketIOServer;

  private readonly DEFAULT_PORT = 5000;

  constructor() {
    this.initialize()
    this.configCors()
    this.handleRoutes()
    this.handleSocketConnection()
  }

  private initialize(): void {
    this.app = express()
    this.httpServer = createServer(this.app)
    this.io = new SocketIOServer(this.httpServer)
    this.handleSocketConnection()
  }

  private configCors(): void {
    const whitelist = ['http://localhost:4200']
    const corsOptions: cors.CorsOptions = {
      origin: (origin, callback) => {
        if (origin && whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          console.log("origin:", origin)
          callback(new Error('Not allowed by CORS'))
        }
      }
    }
    this.app.use(cors(corsOptions))
  }


  private handleRoutes(): void {
    this.app.get("/", (req, res) => {
      const myJson = {
        hello: "world!"
      }
      res.contentType("application/json").send(myJson)
    })

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
  }

  private handleSocketConnection(): void {

    this.io.on("connection", socket => {
      socketHandler.add(socket)
      console.log("Socket connected.")
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