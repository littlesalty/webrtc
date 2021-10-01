import { Component, Input, OnInit } from '@angular/core';
import { ChatMessage } from 'src/app/model/message';

@Component({
  selector: 'app-chat-blob',
  templateUrl: './chat-blob.component.html',
  styleUrls: ['./chat-blob.component.css']
})
export class ChatBlobComponent implements OnInit {

  @Input() chatMessage: ChatMessage
  
  public get isMine(): boolean { return this.chatMessage.isMine }

  public get timestamp() : Date {
    return this.chatMessage.timestamp
  }
  
  public get author() : string {
    return this.chatMessage.userName
  }
  
  public get message() : string {
    return this.chatMessage.content
  }

  constructor() { }

  ngOnInit() {
  }

}
