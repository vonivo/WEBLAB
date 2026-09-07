import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  styleUrl: './skeleton-loader.css',
  templateUrl: './skeleton-loader.html',
})
export class SkeletonLoader {
  readonly width = input<string>('100%');
  readonly height = input<string>('1rem');
  readonly className = input<string>('');
}
