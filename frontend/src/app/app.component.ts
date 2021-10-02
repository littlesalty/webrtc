import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChatMessage } from './model/message';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  userInput = ''
  userName: string | undefined = undefined


  @ViewChild('usernameDialog') usernameDialog: TemplateRef<any>;
  @ViewChild('messageContainer') messageContainer: ElementRef<HTMLDivElement>;
  dialogRef: MatDialogRef<any>;

  chatMessages$: Observable<Array<ChatMessage>> = EMPTY;

  constructor(
    private chat: ChatService,
    private dialog: MatDialog
  ) {
    
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.dialogRef = this.dialog.open(this.usernameDialog)
    this.dialogRef.afterClosed().subscribe(() => {
      this.chat.connect(this.userName ?? 'Anonymous')
      this.chatMessages$ = this.chat.getChatHistory().pipe(
        tap(() => this.scrollToBottom())
      )
    })
  }

  closeDialog() {
    this.dialogRef?.close()
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
    this.chat.sendMessage(message)
    // do something
    this.userInput =''
  }

  private isCodeEnter(event: KeyboardEvent): boolean {
    const isEnter = event.code.toLowerCase() == 'enter'
    console.log('Is enter Key: ', isEnter);
    return isEnter
  }

  private scrollToBottom() {
    if(!this.messageContainer) return 
    const container = this.messageContainer.nativeElement
    setTimeout(() => container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    }), 0)
  }
}
