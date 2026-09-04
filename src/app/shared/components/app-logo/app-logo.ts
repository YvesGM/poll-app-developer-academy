import { Component, input } from '@angular/core';

export type LogoTone = 'orange' | 'dark';

@Component({
  selector: 'app-logo',
  styleUrl: './app-logo.scss',
  templateUrl: './app-logo.html',
})
export class AppLogo {
  readonly tone = input<LogoTone>('orange');
}
