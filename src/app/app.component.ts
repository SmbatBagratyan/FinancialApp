import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RoutesEnum } from './shared/enums/routes.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(
    private router: Router,
    private deviceService: DeviceDetectorService) {
    this.detectDevice();
  }

  detectDevice() {
    if (this.deviceService.isDesktop()) {
      this.router.navigate([RoutesEnum.DESKTOP]);
    } else {
      this.router.navigate([RoutesEnum.MOBILE]);
    }
  }
}
