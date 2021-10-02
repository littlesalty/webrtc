import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UiModule } from '../ui/ui.module';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export const HOST = new InjectionToken<string>('Http host')
export const WS_BASE_URL = new InjectionToken<string>('WebSocket URL');
export const HTTP_BASE_URL = new InjectionToken<string>('Http URL');


const hostName = environment.hostName

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
    { provide: HOST, useValue: hostName },
    { provide: WS_BASE_URL, useValue: `ws://${hostName}` },
    { provide: HTTP_BASE_URL, useValue: `http://${hostName}`}

  ],
})
export class SharedModule { }
