import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, } from '@angular/core';

@Component({
  selector: 'app-battery',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatteryComponent implements OnChanges {
  @Input()
  public batteryLevel: 0;

  public progressColor = '#388e3c';

  ngOnChanges(changes: SimpleChanges): void {
    const batteryLevel = changes.batteryLevel.currentValue;
    if (batteryLevel <= 30) {
      this.progressColor = '#ffab00';
    } else if (batteryLevel <= 15) {
      this.progressColor = '#dd2c00';
    }
  }
}
