import { Directive, ElementRef, Input, OnChanges, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[libSkeletonLoader]'
})
export class SkeletonLoaderDirective implements OnChanges {

  @Input() skeletonLoader: boolean = false;
  @Input() skeletonType: 'table' | 'list' | 'vertical-bar-chart' | 'form' = 'table';
  @Input() rows: number = 5; // Number of rows in the table
  @Input() columns: number = 3; // Number of columns in the table
  @Input() items: number = 5; // Number of items in the list

  private static stylesInjected = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    if (!SkeletonLoaderDirective.stylesInjected) {
      this.injectStyles();
      SkeletonLoaderDirective.stylesInjected = true;
    }
  }

  ngOnChanges(): void {
    if (this.skeletonLoader) {
      this.showSkeletonByType();
    } else {
      this.hideSkeleton();
    }
  }

  private injectStyles() {
    const style = this.renderer.createElement('style');
    style.textContent = `
    .skeleton-table {
      width: 100%;
      table-layout: fixed;
      border-spacing: 12px 5px;
    }
    .skeleton-cell {
      height: 20px;
      background-color: #e5e7eb;
      border-radius: 10px;
      position: relative;
      overflow: hidden;
      width: 100%;
    }
    .skeleton-hr {
      height: 1px;
      background-color: #d1d5db;
      margin: 10px 0; /* Adjust margin to create spacing */
      width: 100%;
    }
    .skeleton-cell::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 200%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      animation: shimmer 1.5s infinite;
    }

   .skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Space between list items */
}

.skeleton-item {
  display: flex;
  align-items: flex-start; /* Align items at the top */
  gap: 10px; /* Space between circle and text */
}

.skeleton-circle {
  width: 70px;
  height: 66px;
  background-color: #e5e7eb;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}

.skeleton-item-lines {
  display: flex;
  flex-direction: column; /* Stack the lines vertically */
  gap: 5px; /* Space between lines */
  width: 100%;
  height: 58px;
  justify-content: space-evenly;
}

.skeleton-line {
  width: 100%;
  height: 17px;
  background-color: #e5e7eb;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.skeleton-line.short {
  width: 70%; /* Shorter line for the second line in each item */
}

.skeleton-circle::after,
.skeleton-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

.skeleton-flex-container {
 display: flex;
    justify-content: flex-start;
    gap: 50px;
    width: 100%;
    flex-direction: column;
}

/* Title skeleton */
.skeleton-title {
  width: 200px;
  height: 20px;
  background-color: #e5e7eb;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}

/* Bar chart container */
.skeleton-bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* Align bars to the bottom */
  height: 150px; /* Height of the chart area */
  width: 30%; /* Adjust width as needed */
}

/* Bars styling */
.skeleton-bar {
  width: 13%;
  background-color: #e0e0e0;
  border-radius: 5px 5px 0 0;
  position: relative;
  overflow: hidden;
}

/* Shimmer effect for bars */
.skeleton-bar::after,
.skeleton-title::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

    @keyframes shimmer {
      0% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(100%);
      }
    }`;

    this.renderer.appendChild(this.document.head, style);
  }

  private showSkeletonByType() {
    switch (this.skeletonType) {
      case 'table':
        this.renderTableSkeleton();
        break;
      case 'vertical-bar-chart':
        this.renderBarChartSkeleton();
        break;
      case 'list':
        this.renderListSkeleton();
        break;
      default:
        this.renderTableSkeleton();
    }
  }

  private hideSkeleton() {
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', '');
  }

  private renderListSkeleton() {
    const container = this.el.nativeElement;
    this.renderer.setProperty(container, 'innerHTML', '');
    this.renderer.addClass(container, 'skeleton-list');

    for (let i = 0; i < this.items; i++) {
      const skeletonItem = this.renderer.createElement('div');
      this.renderer.addClass(skeletonItem, 'skeleton-item');

      const skeletonCircle = this.renderer.createElement('div');
      this.renderer.addClass(skeletonCircle, 'skeleton-circle');
      this.renderer.appendChild(skeletonItem, skeletonCircle);

      const skeletonItemLines = this.renderer.createElement('div');
      this.renderer.addClass(skeletonItemLines, 'skeleton-item-lines');

      const skeletonLine1 = this.renderer.createElement('div');
      this.renderer.addClass(skeletonLine1, 'skeleton-line');
      this.renderer.appendChild(skeletonItemLines, skeletonLine1);

      const skeletonLine2 = this.renderer.createElement('div');
      this.renderer.addClass(skeletonLine2, 'skeleton-line'); // The second line is shorter
      this.renderer.addClass(skeletonLine2, 'short');
      this.renderer.appendChild(skeletonItemLines, skeletonLine2);

      // Append the lines container to the item
      this.renderer.appendChild(skeletonItem, skeletonItemLines);
      this.renderer.appendChild(container, skeletonItem);
    }
  }

  private renderTableSkeleton() {
    const table = this.el.nativeElement;

    this.renderer.addClass(table, 'skeleton-table');
    this.renderer.setProperty(table, 'innerHTML', '');

    const colgroup = this.renderer.createElement('colgroup');
    for (let i = 0; i < this.columns; i++) {
      const col = this.renderer.createElement('col');
      this.renderer.setStyle(col, 'width', `${100 / this.columns}%`);
      this.renderer.appendChild(colgroup, col);
    }
    this.renderer.appendChild(table, colgroup);

    const tbody = this.renderer.createElement('tbody');

    for (let i = 0; i < this.rows; i++) {
      const row = this.renderer.createElement('tr');
      this.renderer.addClass(row, 'skeleton-row');

      for (let j = 0; j < this.columns; j++) {
        const cell = this.renderer.createElement('td');
        this.renderer.addClass(cell, 'skeleton-cell');

        this.renderer.appendChild(row, cell);
      }

      this.renderer.appendChild(tbody, row);

      // Add separator row after each data row except the last one
      if (i < this.rows - 1) {
        const separatorRow = this.renderer.createElement('tr');
        this.renderer.addClass(separatorRow, 'skeleton-hr-row');

        const separatorCell = this.renderer.createElement('td');
        this.renderer.setAttribute(separatorCell, 'colspan', this.columns.toString());

        // Create a <div> for the separator
        const hrDiv = this.renderer.createElement('div');
        this.renderer.addClass(hrDiv, 'skeleton-hr');
        this.renderer.appendChild(separatorCell, hrDiv);

        this.renderer.appendChild(separatorRow, separatorCell);
        this.renderer.appendChild(tbody, separatorRow);
      }
    }

    this.renderer.appendChild(table, tbody);
  }

  private renderBarChartSkeleton() {
    const container = this.el.nativeElement;
    this.renderer.setProperty(container, 'innerHTML', '');
    this.renderer.addClass(container, 'skeleton-bar-chart-wrapper');

    // Create a flexbox container for the title and the bar chart
    const flexContainer = this.renderer.createElement('div');
    this.renderer.addClass(flexContainer, 'skeleton-flex-container');

    // Create the title skeleton on the left
    const title = this.renderer.createElement('div');
    this.renderer.addClass(title, 'skeleton-line');
    this.renderer.addClass(title, 'skeleton-title')
    this.renderer.appendChild(flexContainer, title);

    // Create the bar chart skeleton on the right
    const barChart = this.renderer.createElement('div');
    this.renderer.addClass(barChart, 'skeleton-bar-chart');
    for (let i = 0; i < 6; i++) {
        const skeletonBar = this.renderer.createElement('div');
        this.renderer.addClass(skeletonBar, 'skeleton-bar');

        // Set varying height for each bar
        const barHeight = `${Math.random() * 60 + 40}%`; // Random heights between 40% and 100%
        this.renderer.setStyle(skeletonBar, 'height', barHeight);

        this.renderer.appendChild(barChart, skeletonBar);
    }

    // Append the bar chart to the flex container
    this.renderer.appendChild(flexContainer, barChart);
    this.renderer.appendChild(container, flexContainer);
}

}
