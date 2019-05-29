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
    BatteryComponent
  ],
  imports: [
    BrowserModule,
    // NgCircleProgressModule.forRoot({
    //   radius: 60,
    //   space: -10,
    //   maxPercent: 100,
    //   outerStrokeGradient: true,
    //   outerStrokeWidth: 10,
    //   outerStrokeColor: '#4882c2',
    //   outerStrokeGradientStopColor: '#53a9ff',
    //   innerStrokeColor: '#e7e8ea',
    //   innerStrokeWidth: 10,
    //   title: 'UI',
    //   animateTitle: false,
    //   animationDuration: 1000,
    //   showTitle: false,
    //   showUnits: false,
    //   showBackground: false
    // }),

    // RoundProgressModule,
    Ng2ArcProgressModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
