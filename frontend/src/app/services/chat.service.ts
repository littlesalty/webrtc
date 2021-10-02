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

  readonly myUserName = 'NanoSpicer'
  socket: Socket;

  private chatMessages$ = new BehaviorSubject<Array<ChatMessage>>([]);

  constructor(
    @Inject(HTTP_BASE_URL) private baseUrl: string,
    @Inject(WS_BASE_URL) private wsbaseUrl: string,
    private http: HttpClient
  ) {

    this.socket = io(this.wsbaseUrl)

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
  }


  getFakeChatHistory(): Observable<Array<ChatMessage>> {
    return interval(2_000).pipe(
      map(size => {
        return Array
          .from({ length: size + 20 }).map((_, index) => {
            let fakeMessage = {
              userName: 'NanoSpicer',
              content: 'I am super mega cool',
              timestamp: new Date(),
              isMine: true
            }

            fakeMessage =
              index % 3 === 0
                ? fakeMessage
                : { ...fakeMessage, userName: 'LittleSalty', isMine: false }

            return fakeMessage
          })
      })
    )
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
    const chatMessage: ChatMessage = {
      content: message.trim(),
      userName: this.myUserName,
      isMine: true,
      timestamp: new Date()
    }
    this.socket?.emit('sendMessage', chatMessage)
  }

  getChatHistoryImpl(): Observable<Array<ChatMessage>> {
    const endpoint = `${this.baseUrl}/chat-history`
    return this.http.get<Array<ChatMessage>>(endpoint)
  }

}
