import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessage } from './model/message';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userInput = ''

  chatMessages$: Observable<Array<ChatMessage>>;

  constructor(private chat: ChatService) {
    this.chatMessages$ = this.chat.getChatHistory()
  }

  ngOnInit() {

  }
}
