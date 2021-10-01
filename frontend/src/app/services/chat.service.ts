import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
    const fakeMessages = Array.from({length: 10}).map((_, index) => {
      let fakeMessage = {
        userName: 'NanoSpicer',
        content: 'I am super mega cool',
        timestamp: new Date(),
        isMine: true
      }

      fakeMessage = 
        index === 3 
          ? fakeMessage
          : {...fakeMessage, userName: 'LittleSalty', isMine: false} 

      return fakeMessage
    })

    return of(fakeMessages)
    // https://5e1d-85-58-30-151.ngrok.io/chat
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
