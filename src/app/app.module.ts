import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Ng2ArcProgressModule } from 'angular2-arc-progress';
import { ConnectionServiceModule } from 'ng-connection-service';
import { MomentModule } from 'ngx-moment';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WatchFaceComponent } from './components/watch-face/watch-face.component';
import { BatteryComponent } from './components/battery/battery.component';
import { WeatherComponent } from './components/weather/weather.component';

@NgModule({
  declarations: [
    AppComponent,
    WatchFaceComponent,
    BatteryComponent,
    WeatherComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    Ng2ArcProgressModule,
    ConnectionServiceModule,
    MomentModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
