import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { interval, Observable, of, Subject, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '../model/message';
import { HTTP_BASE_URL, WS_BASE_URL } from '../shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  readonly myId = 'NanoSpicer'
  socket: Socket;

  incomingChatMessage = new Subject<ChatMessage>();

  constructor(
    @Inject(HTTP_BASE_URL) private baseUrl: string,
    @Inject(WS_BASE_URL) private wsbaseUrl: string,
    private http: HttpClient
  ) { 
    console.log(wsbaseUrl);
    
    this.socket =io(this.wsbaseUrl)

    this.socket.on('connect', () => console.log('Connected ✅'))
    this.socket.on('sendMessage', args => console.log('sendMessage', args))

    setTimeout(() => {

      this.socket.emit('sendMessage', {
        userId: 'fake',
        userName: 'NanoSpicer',
        content: 'I am super mega cool',
        timestamp: new Date(),
        isMine: true
      })
      console.log('message sent ✅')
    }, 1000)
  }


  getFakeChatHistory(): Observable<Array<ChatMessage>>{
    return interval(2_000).pipe(
      map(size => {
        return Array
          .from({length: size + 20}).map((_, index) => {
            let fakeMessage = {
              userName: 'NanoSpicer',
              content: 'I am super mega cool',
              timestamp: new Date(),
              isMine: true
            }
      
            fakeMessage = 
              index % 3  === 0
                ? fakeMessage
                : {...fakeMessage, userName: 'LittleSalty', isMine: false} 
      
            return fakeMessage
          })
      })
    )
  }

  getChatHistory(): Observable<Array<ChatMessage>> {
    return this.getChatHistoryImpl()
  }

  getChatHistoryImpl(): Observable<Array<ChatMessage>> {
    const endpoint = `${this.baseUrl}/chat-history`
    return this.http.get<Array<ChatMessage>>(endpoint).pipe(
      map((msgs: Array<ChatMessage>) =>msgs.map(it => ({...it, isMine: it.userName === this.myId})) )
    )
  }

}
