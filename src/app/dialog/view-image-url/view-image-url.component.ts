import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { CategoryManagementComponent } from 'src/app/category-management/category-management.component';

@Component({
  selector: 'app-view-image-url',
  templateUrl: './view-image-url.component.html',
  styleUrls: ['./view-image-url.component.scss']
})
export class ViewImageUrlComponent {

  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<CategoryManagementComponent>
  ) {
  }

  ngOnInit(): void {
  }

  closeDialogBox = () => {
    this.dialogRef.close({ 'status': 'close' })
  }


}
