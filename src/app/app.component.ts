import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

declare var tizen: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    if (typeof tizen === 'undefined' || !Boolean(tizen.ppm)) { return; }
    const healthinfoPermission = tizen.ppm.checkPermission('http://tizen.org/privilege/healthinfo');
    const locationPermission = tizen.ppm.checkPermission('http://tizen.org/privilege/location');
    switch (healthinfoPermission) {
      case 'PPM_ASK':
        tizen.ppm.requestPermission('http://tizen.org/privilege/healthinfo');
    }

    switch (locationPermission) {
      case 'PPM_ASK':
        tizen.ppm.requestPermission('http://tizen.org/privilege/location');
    }
  }
}
