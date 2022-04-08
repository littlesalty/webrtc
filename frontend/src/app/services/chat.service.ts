import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, of, Subject, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { ChatMessage } from '../model/message';
import { SOCKET_IO_CONFIG } from '../shared/shared.module';

type SocketIOConfig = typeof environment.socketio;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private myUserName: string | undefined
  private connected = false
  socket: Socket | undefined;

  private chatMessages$: BehaviorSubject<Array<ChatMessage>>

  constructor(
    @Inject(SOCKET_IO_CONFIG) 
    private socketioConfig: SocketIOConfig,
  ) {
  }

  connect(userName: string) {
    this.myUserName = userName
    this.chatMessages$ = new BehaviorSubject<Array<ChatMessage>>([])
    this.socket = io(this.socketioConfig.uri, this.socketioConfig.options)

    this.socket.on('connect', () => console.log('Connected ✅'))
    this.socket.on('sendMessage', chatMessages => {
      console.log('Topic - sendMessage', chatMessages)
      const safeArray =
        Array.isArray(chatMessages)
          ? chatMessages
          : [chatMessages]

      const oldMessages = this.chatMessages$.getValue()

      const newChatHistory = [...oldMessages, ...safeArray]

      this.chatMessages$.next(newChatHistory)
    })
    this.connected = true
  }

  disconnect() {
    this.connected = false
    this.myUserName = undefined
    this.socket?.disconnect()
    this.socket = undefined
  }


  getChatHistory(): Observable<Array<ChatMessage>> {

    return this.chatMessages$.asObservable().pipe(
      map((msgs: Array<ChatMessage>) => {
        // compare username to mark whether a message is mine or not 
        return msgs.map(it => ({ ...it, isMine: it.userName === this.myUserName }))
      })
    )
  }

  sendMessage(message: string) {
    if (!this.connected) return
    const chatMessage: ChatMessage = {
      content: message.trim(),
      userName: this.myUserName!,
      isMine: true,
      timestamp: new Date()
    }
    this.socket?.emit('sendMessage', chatMessage)
  }

}
