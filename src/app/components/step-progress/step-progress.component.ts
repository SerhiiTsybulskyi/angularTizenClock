import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

declare var tizen: any;

@Component({
  selector: 'app-step-progress',
  templateUrl: './step-progress.component.html',
  styleUrls: ['./step-progress.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepProgressComponent implements OnInit {
  public debug: any;

  constructor() {}

  ngOnInit() {
    // this.getSteps();
    try {
      tizen.humanactivitymonitor.setAccumulativePedometerListener(this.onchangedCB.bind(this));
      // tizen.humanactivitymonitor.start('PEDOMETER', this.onchangedCB.bind(this));
      tizen.humanactivitymonitor.getHumanActivityData('PEDOMETER', this.onchangedCB.bind(this), null);
      // tizen.humanactivitymonitor.getHumanActivityData('PEDOMETER', this.onRead.bind(this), this.onError.bind(this));
      setTimeout(() => {
        tizen.humanactivitymonitor.unsetAccumulativePedometerListener();
      }, 10000);
    } catch (err) {
      this.debug = err;
    }
  }

  onRender(event: Event) {
    console.log(event);
  }

  getSteps() {
    const type = 'PEDOMETER';
    const now = new Date();
    const startTime = now.setDate(now.getDate() - 4);
    const anchorTime = (new Date()).getTime();
    const query = {
        startTime: startTime / 1000,
        anchorTime: anchorTime / 1000,
        interval: 1440  /* 1 day. */
      };

    try {
      tizen.humanactivitymonitor.readRecorderData(type, query, this.onRead.bind(this), this.onError.bind(this));
    } catch (err) {
      this.debug = err;
    }
  }

  onRead(data) {
    this.debug = data;
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log(JSON.stringify(data));
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++');
  }

  onError(error) {
    this.debug = error;
    console.log('---------------------------------------------------------');
    console.log(JSON.stringify(error));
    console.log('---------------------------------------------------------');
  }

  onchangedCB(pedometerInfo) {
    this.debug = pedometerInfo.accumulativeTotalStepCount;
    console.log(JSON.stringify(pedometerInfo));
    console.log('Step status: ' + pedometerInfo.stepStatus);
    console.log('Accumulative total step count: ' + pedometerInfo.accumulativeTotalStepCount);
  }
}
