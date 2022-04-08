import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UiModule } from '../ui/ui.module';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export const HOST = new InjectionToken<string>('Http host')
export const SOCKET_IO_CONFIG = new InjectionToken<string>('SocketIO configuration');
export const HTTP_BASE_URL = new InjectionToken<string>('Http URL');

const apiBaseUrl = environment.apiBaseUrl

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    UiModule
  ],
  exports: [
    HttpClientModule,
    UiModule,
  ],
  providers: [
    DatePipe,
    { provide: HOST, useValue: window.location.host },
    { provide: SOCKET_IO_CONFIG, useValue: environment.socketio },
    { provide: HTTP_BASE_URL, useValue: apiBaseUrl }

  ],
})
export class SharedModule { }
