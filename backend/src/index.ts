import { Server } from "./server"


export type ConfigFile = {
    production: boolean
}
const configLoader = (): ConfigFile => require('./environment/env.json')
const config = configLoader()
const server = new Server(config)

server.listen(port => console.log(`Server running on http://localhost:${port}`))
