import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  totalRows = 0;
  pageSize = 10;
  currentPage = 1;
  @Input('userlistcount') userlistcount: any;
  pageSizeOptions: number[] = [10, 20, 30, 40, 100];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges() {
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
  }
}