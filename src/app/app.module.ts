import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Ng2ArcProgressModule } from 'angular2-arc-progress';

import { AppComponent } from './app.component';
import { WatchFaceComponent } from './components/watch-face/watch-face.component';
import { BatteryComponent } from './components/battery/battery.component';

@NgModule({
  declarations: [
    AppComponent,
    WatchFaceComponent,
    BatteryComponent,
  ],
  imports: [
    BrowserModule,
    Ng2ArcProgressModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
