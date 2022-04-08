import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, of, Subject, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '../model/message';
import { HTTP_BASE_URL, WS_BASE_URL } from '../shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private myUserName: string | undefined
  private connected = false
  socket: Socket | undefined;

  private chatMessages$: BehaviorSubject<Array<ChatMessage>>

  constructor(
    @Inject(WS_BASE_URL) private wsbaseUrl: string,
  ) {
  }

  connect(userName: string) {
    this.myUserName = userName
    this.chatMessages$ = new BehaviorSubject<Array<ChatMessage>>([])
    this.socket = io(this.wsbaseUrl, { path: "/chat/api/socket.io" })

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
