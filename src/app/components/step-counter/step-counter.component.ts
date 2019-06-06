import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-step-counter',
  templateUrl: './step-counter.component.html',
  styleUrls: ['./step-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepCounterComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
