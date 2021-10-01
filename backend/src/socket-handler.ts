import { Socket } from "socket.io"

class SocketHandler {
    activeSockets: Socket[] = []
    add(socket: Socket) {
        const existingSocket = this.activeSockets.find(
            existingSocket => existingSocket.id === socket.id
        )

        if (!existingSocket) {
            this.activeSockets.push(socket)

            socket.emit("update-user-list", {
                users: this.activeSockets.filter(
                    existingSocket => existingSocket.id !== socket.id
                )
            })
        }
    }

    remove(socket: Socket) {

        this.activeSockets = this.activeSockets.filter(activeAocket => activeAocket.id == socket.id)

    }
}

export const socketHandler = new SocketHandler()
