import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Ng2ArcProgressModule } from 'angular2-arc-progress';

import { AppComponent } from './app.component';
import { WatchFaceComponent } from './components/watch-face/watch-face.component';
import { BatteryComponent } from './components/battery/battery.component';
import { WeatherComponent } from './components/weather/weather.component';
import { HttpClientModule } from '@angular/common/http';
import { StepProgressComponent } from './components/step-progress/step-progress.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { StepCounterComponent } from './components/step-counter/step-counter.component';

@NgModule({
  declarations: [
    AppComponent,
    WatchFaceComponent,
    BatteryComponent,
    WeatherComponent,
    StepProgressComponent,
    StepCounterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoundProgressModule,
    Ng2ArcProgressModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
