import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateUtils } from '../../utils/date.utils';

declare var tizen: any;

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

  public iconUrl: string;
  public temperature: number;
  public isReady = false;
  public lastUpdateTime: Date;
  public isTizen = false;

  public interval;

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) {
    this.isTizen = typeof tizen !== 'undefined';
  }

  ngOnInit() {
    if (this.isTizen) {
      const internetPermission = tizen.ppm.checkPermission('http://tizen.org/privilege/internet');
      switch (internetPermission) {
        case 'PPM_ASK':
          tizen.ppm.requestPermission('http://tizen.org/privilege/internet');
      }
    }

    this.lat = 49.4285;
    this.lon = 32.0621;
    this.getWeatherData();
    this.interval = setInterval(this.getWeatherData.bind(this), 900000);
  }

  getWeatherData() {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=${this.apiId}&units=${this.units}`;

    this.http.get(weatherApiUrl).subscribe(this.weatherDataHandler.bind(this), () => this.isReady = false);
  }

  weatherDataHandler(data) {
    this.iconUrl = `${this.iconPrefixUrl}${data.weather[0].icon}.png`;
    this.temperature = data.main.temp;
    const date = DateUtils.getDate(this.isTizen);
    this.lastUpdateTime = new Date(
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

  getUnits(): string {
    return this.units === 'metric' ? '°C' : '°F';
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
