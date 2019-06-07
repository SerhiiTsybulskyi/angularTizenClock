import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateUtils } from '../../utils/date.utils';
import { ConnectionService } from 'ng-connection-service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import * as moment from 'moment';

declare var tizen: any;
declare var navigator: any;

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherComponent implements OnInit, OnDestroy {
  private lat: number;
  private lon: number;
  private units = 'metric'; // imperial
  private apiId = '067374a53010d9d6beca3bea2060d8e9';
  private iconPrefixUrl = 'https://openweathermap.org/img/w/';
  private locationOptions = { maximumAge: 600000 };

  public iconUrl: string;
  public temperature: number;
  public city: string;
  private _isReady = false;
  public lastUpdateWeatherTime: Date;
  public lastUpdateLocationTime: Date;
  public isTizen = false;
  public isInternetMissing = false;
  public isLocationMissing = false;

  public debug;

  private readonly weatherUpdateInterval = 30; // minutes
  private readonly locationUpdateInterval = 3; // hours
  private readonly screenOff = 'SCREEN_OFF';
  private readonly screenOn = 'SCREEN_NORMAL';

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef, private connectionService: ConnectionService) {
    this.isTizen = typeof tizen !== 'undefined';
  }

  ngOnInit() {
    if (this.isTizen) {
      const internetPermission = tizen.ppm.checkPermission('http://tizen.org/privilege/internet');
      switch (internetPermission) {
        case 'PPM_ASK':
          tizen.ppm.requestPermission('http://tizen.org/privilege/internet');
      }

      tizen.power.setScreenStateChangeListener(this.onScreenStateChangeHandler.bind(this));
    }

    this.connectionService.monitor().subscribe((isConnected: boolean) => {
      this.isInternetMissing = !isConnected;
      this.cdRef.markForCheck();
    });

    this.lat = 49.4285;
    this.lon = 32.0621;
    this.updateWeatherData(true);
    this.getCurrentLocation(true);

    // this.debug = navigator.appVersion;
    // this.cdRef.markForCheck();
  }

  updateWeatherData(force = false) {
    if (force || moment().add(this.weatherUpdateInterval, 'minutes').isBefore(moment(this.lastUpdateWeatherTime))) {
      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather` +
        `?lat=${this.lat}&lon=${this.lon}&appid=${this.apiId}&units=${this.units}`;

      this.http.get(weatherApiUrl).pipe(
        catchError((err) => {
          if (err.status === 0) {
            this.isInternetMissing = true;
            this.cdRef.markForCheck();
          }
          return throwError(err);
        }),
      ).subscribe(this.weatherDataHandler.bind(this), () => this.weatherErrorHandler.bind(this));
    }
  }

  weatherDataHandler(data): void {
    this.iconUrl = `${this.iconPrefixUrl}${data.weather[0].icon}.png`;
    this.temperature = data.main.temp;
    this.city = data.name;
    const date = DateUtils.getDate(this.isTizen);
    this.lastUpdateWeatherTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
    this.isReady = true;
    this.cdRef.markForCheck();
  }

  weatherErrorHandler(err): void {
    this.isReady = false;
    this.cdRef.markForCheck();
  }

  locationUpdateHandler(location: Position) {
    this.lon = location.coords.longitude;
    this.lat = location.coords.latitude;
    this.isLocationMissing = false;
    this.updateWeatherData();
  }

  locationErrorHandler(err) {
    this.isLocationMissing = true;
    const date = DateUtils.getDate(this.isTizen);
    this.lastUpdateLocationTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
    this.cdRef.markForCheck();
  }

  getUnits(): string {
    return this.units === 'metric' ? '°C' : '°F';
  }

  getCurrentLocation(force = false): void {
    if (force || moment().add(this.locationUpdateInterval, 'hours').isBefore(moment(this.lastUpdateWeatherTime))) {
      navigator.geolocation.getCurrentPosition(
        this.locationUpdateHandler.bind(this),
        this.locationErrorHandler.bind(this),
        this.locationOptions
      );
    }
  }

  onScreenStateChangeHandler(previousState, changedState) {
    if (changedState === this.screenOn) {
      this.updateWeatherData();
    }
  }

  get isReady(): boolean {
    return this._isReady;
  }

  set isReady(value: boolean) {
    this._isReady = value;
    if (this._isReady) {
      this.isInternetMissing = false;
    }
  }

  ngOnDestroy(): void {}
}
