import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { interval, Observable, of, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatMessage } from '../model/message';
import { BASE_URL } from '../shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  readonly myId = 'NanoSpicer'

  constructor(
    @Inject(BASE_URL) private baseUrl: string,
    private http: HttpClient
  ) { }


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
    return this.getFakeChatHistory()
  }

  getChatHistoryImpl(): Observable<Array<ChatMessage>> {
    const endpoint = `${this.baseUrl}/chat-history`
    return this.http.get<Array<ChatMessage>>(endpoint).pipe(
      map((msgs: Array<ChatMessage>) =>msgs.map(it => ({...it, isMine: it.userName === this.myId})) )
    )
  }

}
