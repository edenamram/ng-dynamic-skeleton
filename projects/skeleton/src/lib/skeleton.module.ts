import { NgModule } from '@angular/core';
import { SkeletonComponent } from './skeleton.component';
import { SkeletonLoaderDirective } from './skeleton-loader.directive';



@NgModule({
  declarations: [
    SkeletonComponent,
    SkeletonLoaderDirective
  ],
  imports: [
  ],
  exports: [
    SkeletonComponent,
    SkeletonLoaderDirective
  ]
})
export class SkeletonModule { }
