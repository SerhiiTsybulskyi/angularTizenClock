import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

declare var tizen: any;
declare var navigator: any;

@Component({
  selector: 'app-watch-face',
  templateUrl: './watch-face.component.html',
  styleUrls: ['./watch-face.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchFaceComponent implements OnInit, OnDestroy, AfterViewInit {
  public secondArray: Array<number>;
  public day: number;
  public secondAngle: number;
  public minuteAngle: number;
  public hourAngle: number;
  public isAmbientMode = false;
  public updateTimeInterval: number;
  public updateBatteryInterval: number;

  public isTizen: boolean;
  public timetick = 0;
  public gearBatteryLevel = 0;

  constructor(private elRef: ElementRef, private cdRef: ChangeDetectorRef) {
    this.secondArray = Array(60).fill(1).map((x, i) => i);
    this.isTizen = !(typeof tizen === 'undefined');
  }

  ngOnInit() {
    this.updateBatteryLevel();
    this.updateTimeInterval = setInterval(this.updateTime.bind(this), 1000);
    const fiveMinutes = 300000;
    this.updateBatteryInterval = setInterval(this.updateBatteryLevel.bind(this), fiveMinutes);
    const date = this.getDate();
    this.day = date.getDate();

    document.addEventListener('ambientmodechanged', this.anmientModeHandler.bind(this));
  }

  ngAfterViewInit(): void {
    this.cdRef.detach();
  }

  public anmientModeHandler(event: any): void {
    this.isAmbientMode = event.detail.ambientMode;
    // this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  getRotateValue(index: number): string {
    return `rotate(${6 * index}deg)`;
  }

  getDate(): Date {
    return this.isTizen ? tizen.time.getCurrentDateTime() : new Date();
  }

  updateTime(): void {
    const date = this.getDate();
    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hours = date.getHours();

    this.secondAngle = seconds * 6;
    this.minuteAngle = minutes * 6 + seconds * (360 / 3600);
    this.hourAngle = hours * 30 + minutes * (360 / 720);

    // this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  getRotateStyle(angle: number): string {
    return `rotate(${angle}deg)`;
  }

  updateBatteryLevel() {
    if (this.isTizen) {
      tizen.systeminfo.getPropertyValue('BATTERY', (data) => {
        this.gearBatteryLevel = (data.level * 100.0);
      });
    } else {
      navigator.getBattery().then(a => this.gearBatteryLevel = a.level * 100.0);
    }

    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    clearInterval(this.updateTimeInterval);
    clearInterval(this.updateBatteryInterval);
    document.removeEventListener('ambientmodechanged', this.anmientModeHandler, false);
  }

}
