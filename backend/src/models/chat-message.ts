export type ChatMessage = {
    userId: string
    userName: string
    content: string
    timestamp: Date
}

export const startingMockMessages: ChatMessage[] = [
    {
        userId: "NanoSpicer",
        userName: "NanoSpicer",
        content: "Hola, me llamo PIPO",
        timestamp: new Date("10 Oct 2021 19:00 GMT+0100")
    },
    {
        userId: "NanoSpicer",
        userName: "NanoSpicer",
        content: "Ojalá que shueva",
        timestamp: new Date("10 Oct 2021 19:13 GMT+0100")
    },
    {
        userId: "littleSalty",
        userName: "littleSalty",
        content: "Pa que m... queres que shueva",
        timestamp: new Date("10 Oct 2021 19:15 GMT+0100")
    },
    {
        userId: "NanoSpicer",
        userName: "NanoSpicer",
        content: "porque quiero ver GOTAS",
        timestamp: new Date("10 Oct 2021 19:19 GMT+0100")
    }
]