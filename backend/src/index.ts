import { Server } from "./server"


export type ConfigFile = {
    production: boolean
}
const configLoader = (): ConfigFile => {

    const fileToLoad = process.env.NODE_ENV === "prod" ?
        "./environment/prod.json" : "./environment/dev.json"

    return require(fileToLoad)
}

const config = configLoader()
const server = new Server(config)

server.listen(port => {
    console.log(`Server is listening on http://localhost:${port}/chat-history`)
})
