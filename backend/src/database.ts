import { ChatMessage, startingMockMessages } from "./models/chat-message"
import Loki from "lokijs"
import path from "path"

export class ServerDatabase {
    private messagesTable = "messages"
    private db: Loki
    constructor() {
        this.initialize()
        this.seedDbIfEmpty()
    }
    private initialize() {
        const delimiter = path.delimiter
        const filePath = `src${delimiter}database${delimiter}data.db`
        this.db = new Loki(filePath)
        this.db.addCollection(this.messagesTable)

    }
    private seedDbIfEmpty() {
        const data = this.db.listCollections()
        if (data.length > 0) {
            this.db.getCollection<ChatMessage>(this.messagesTable).insert(startingMockMessages)
        }
    }
    addMessage = (chatMessage: ChatMessage): void => {
        this.db.getCollection<ChatMessage>(this.messagesTable).insert(chatMessage)
    }
    readMessages = (): ChatMessage[] => {
        return this.db.getCollection<ChatMessage>(this.messagesTable).find() ?? []
    }
}

export const serverDatabase = new ServerDatabase()