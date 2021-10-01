import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UiModule } from '../ui/ui.module';
import { HttpClientModule } from '@angular/common/http';

export const BASE_URL = new InjectionToken<string>('page.title');

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
    { provide: BASE_URL, useValue: 'https://5e1d-85-58-30-151.ngrok.io'}

  ],
})
export class SharedModule { }
