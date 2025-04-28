import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-cusine-popup',
  templateUrl: './cusine-popup.component.html',
  styleUrls: ['./cusine-popup.component.scss'],
})
export class CusinePopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { cuisines: string[] }) {}
}
