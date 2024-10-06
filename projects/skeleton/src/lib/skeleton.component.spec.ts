import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Renderer2, ElementRef } from '@angular/core';
import { SkeletonLoaderDirective } from './skeleton-loader.directive';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let component: SkeletonComponent;
  let fixture: ComponentFixture<SkeletonComponent>;
  let renderer2: Renderer2;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkeletonComponent, SkeletonLoaderDirective], // Include both the component and directive
      providers: [Renderer2]
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonComponent);
    component = fixture.componentInstance;
    renderer2 = fixture.debugElement.injector.get(Renderer2); // Get the Renderer2 instance
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  

  it('should apply the skeletonLoader directive and render the skeleton', () => {
    component.isSkeletonVisible = true;
    fixture.detectChanges(); // Trigger Angular's change detection

    const divElement = fixture.nativeElement.querySelector('div');
    expect(divElement).not.toBeNull(); // Ensure the div with the directive is present
  });

  it('should hide the skeleton when skeletonLoader is false', () => {
    component.isSkeletonVisible = false;
    fixture.detectChanges();

    const divElement = fixture.nativeElement.querySelector('div');
    expect(divElement.innerHTML).toBe(''); // Check if the skeleton is cleared
  });
});
