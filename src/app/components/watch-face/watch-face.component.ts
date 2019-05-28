import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

declare var tizen: any;

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
  public updateInterval: number;

  public isTizen: boolean;
  public timetick = 0;

  constructor(private elRef: ElementRef, private cdRef: ChangeDetectorRef) {
    this.secondArray = Array(60).fill(1).map((x, i) => i);
    this.isTizen = !(typeof tizen === 'undefined');
  }

  ngOnInit() {
    this.updateInterval = setInterval(this.updateTime.bind(this), 1000);
    const date = this.getDate();
    this.day = date.getDate();

    document.addEventListener('ambientmodechanged', this.anmientModeHandler.bind(this));
    /* Check whether high color mode is supported or not*/
    // var isHighColorMode = tizen.systeminfo.getCapability("http://tizen.org/feature/screen.always_on.high_color");
  }

  ngAfterViewInit(): void {
    this.cdRef.detach();
  }

  public anmientModeHandler(event: any): void {
    this.isAmbientMode = event.detail.ambientMode;
    // this.cdRef.markForCheck();
    this.cdRef.detectChanges();
    // if (this.isAmbientMode) {
    // clearInterval(this.updateInterval);
    // document.addEventListener('timetick', () => {
    //   this.timetick++;
    //   this.updateTime();
    // });
    // } else {
    // this.updateInterval = setInterval(this.updateTime.bind(this), 1000);
    // this.timetick = 0;
    // document.removeEventListener('timetick', this.updateTime, false);
    // }
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

  ngOnDestroy(): void {
    clearInterval(this.updateInterval);
    document.removeEventListener('ambientmodechanged', this.anmientModeHandler, false);
  }

}
