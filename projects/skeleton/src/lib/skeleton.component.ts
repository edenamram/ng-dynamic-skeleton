import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-skeleton',
  template: `
  <div libSkeletonLoader [skeletonLoader]="isSkeletonVisible" skeletonType="table">
    <!-- This div will use the directive -->
  </div>
`,
  styles: [
  ]
})
export class SkeletonComponent implements OnInit {
  isSkeletonVisible = true;
  constructor() { }

  ngOnInit(): void {
  }

}
