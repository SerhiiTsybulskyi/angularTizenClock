import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WatchFaceComponent } from './components/watch-face/watch-face.component';

@NgModule({
  declarations: [
    AppComponent,
    WatchFaceComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
