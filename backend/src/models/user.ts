import { ChatMessage } from "./chat-message"

export type User = {
    id: string
    name: string
    messages: ChatMessage[]
}