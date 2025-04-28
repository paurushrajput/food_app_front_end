import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';

@Component({
  selector: 'app-confirm-logout',
  templateUrl: './confirm-logout.component.html',
  styleUrls: ['./confirm-logout.component.scss']
})
export class ConfirmLogoutComponent {
  constructor(
    public dialog: MatDialog,
    public service: AppService,
    private route: Router
  ) { }

  ngOnInit(): void {
  }

  adminLogout() {
    this.service.getApiWithAuth(`/admin/logout`).subscribe((success: any) => {
      if (success.success) {
        this.service.success('Logout successfully')
        this.service.clearLocalStorage();
        this.route.navigate(['/'])
        this.dialog.closeAll()
      } else {
        this.service.error(success.msg)
      }
    })

  }

  closeDialogBox(): void {
    this.dialog.closeAll()
  }
}
