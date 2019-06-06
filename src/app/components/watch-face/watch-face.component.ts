import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { DateUtils } from '../../utils/date.utils';

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
  public gearBatteryLevel = 0;

  public debug: any;

  private readonly screenOff = 'SCREEN_OFF';
  private readonly screenOn = 'SCREEN_NORMAL';

  private secHandEl: HTMLElement;
  private minHandEl: HTMLElement;
  private hourHandEl: HTMLElement;

  private prevMinutes: number;

  constructor(private elRef: ElementRef, private cdRef: ChangeDetectorRef) {
    this.secondArray = Array(60).fill(1).map((x, i) => i);
    this.isTizen = !(typeof tizen === 'undefined');
  }

  ngOnInit() {
    this.showHands();
    this.initBatteryLevelListener();

    this.updateTimeInterval = setInterval(this.updateTime.bind(this), 1000);
    const date = DateUtils.getDate(this.isTizen);
    this.day = date.getDate();
    document.addEventListener('ambientmodechanged', this.anmientModeHandler.bind(this));

    if (this.isTizen) {
      tizen.power.setScreenStateChangeListener(this.onScreenStateChangeHandler.bind(this));
    }
  }

  ngAfterViewInit(): void {
    this.cdRef.detach();
    this.secHandEl = this.elRef.nativeElement.querySelector('.sec-hand:not(.shadow)');
    this.minHandEl = this.elRef.nativeElement.querySelector('.min-hand:not(.shadow)');
    this.hourHandEl = this.elRef.nativeElement.querySelector('.hour-hand:not(.shadow)');
  }

  public anmientModeHandler(event: any): void {
    this.isAmbientMode = event.detail.ambientMode;
    if (this.isAmbientMode) {
      this.showHands();
    }
    this.cdRef.detectChanges();
  }

  getRotateValue(index: number): string {
    return `rotate(${6 * index}deg)`;
  }

  updateTime(): void {
    const date = DateUtils.getDate(this.isTizen);
    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hours = date.getHours();

    this.secondAngle = seconds * 6;
    this.minuteAngle = minutes * 6 + seconds * (360 / 3600);
    this.hourAngle = hours * 30 + minutes * (360 / 720);
    this.day = date.getDate();
    if (!this.prevMinutes || this.prevMinutes !== minutes) {
      setTimeout(() => this.updateDialStyle(minutes));
    }

    this.cdRef.detectChanges();
  }

  updateDialStyle(minutes): void {
    const dialLines = this.elRef.nativeElement.querySelectorAll('.diallines');
    if (dialLines.length) {
      for (let i = 0; i < dialLines.length; i++) {
        if (i <= minutes) {
          dialLines[i].classList.add('highlight');
        } else {
          dialLines[i].classList.remove('highlight');
        }
      }
    }
  }

  getRotateStyle(angle: number): string {
    return `rotate(${angle}deg)`;
  }

  initBatteryLevelListener() {
    navigator.getBattery().then((battery) => {
      this.gearBatteryLevel = battery.level * 100.0;
      battery.onlevelchange = (event) => this.gearBatteryLevel = (event.currentTarget.level * 100.0);
      this.cdRef.detectChanges();
    });
  }

  onScreenStateChangeHandler(previousState, changedState) {
    if (changedState === this.screenOn) {
      this.showHands();
    } else {
      this.hideHands();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.updateTimeInterval);
    clearInterval(this.updateBatteryInterval);
    document.removeEventListener('ambientmodechanged', this.anmientModeHandler, false);
    navigator.getBattery().then((battery) => {
      battery.onlevelchange = null;
    });
    if (this.isTizen) {
      tizen.power.unsetScreenStateChangeListener();
    }
  }

  private showHands() {
    this.updateTime();
    requestAnimationFrame(() => {
      this.hourHandEl.classList.add('visible');
      this.minHandEl.classList.add('visible');
      if (!this.isAmbientMode) {
        this.secHandEl.classList.add('visible');
      }
    });
  }

  private hideHands() {
    requestAnimationFrame(() => {
      this.hourHandEl.classList.remove('visible');
      this.minHandEl.classList.remove('visible');
      this.secHandEl.classList.remove('visible');
    });
  }

}
