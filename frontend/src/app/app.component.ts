import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChatMessage } from './model/message';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userInput = ''

  @ViewChild('messageContainer') messageContainer: ElementRef<HTMLDivElement>;

  chatMessages$: Observable<Array<ChatMessage>>;

  constructor(private chat: ChatService) {
    this.chatMessages$ = this.chat.getChatHistory().pipe(
      tap(() => this.scrollToBottom())
    )
  }

  ngOnInit() {

  }

  submitOnEnterKey(event: Event) {
    const ev = event as KeyboardEvent
    this.isCodeEnter(ev) 
      ? this.submit(this.userInput) 
      : undefined
  }

  submit(message: string) {
    const trimmedMessage = message.trim()
    if(trimmedMessage.length === 0) return

    // do something
    this.userInput =''
  }

  private isCodeEnter(event: KeyboardEvent): boolean {
    const isEnter = event.code.toLowerCase() == 'enter'
    console.log('Is enter Key: ', isEnter);
    return isEnter
  }

  private scrollToBottom() {
    const container = this.messageContainer.nativeElement
    setTimeout(() => container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    }), 0)
  }
}
