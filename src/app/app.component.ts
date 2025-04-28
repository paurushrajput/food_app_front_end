import { ChangeDetectorRef, Component, NgZone, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmLogoutComponent } from './dialog/confirm-logout/confirm-logout.component';
import { AppService } from 'src/app.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isExpanded = false;
  klass_nav = "closed-nav";
  title = 'angular-material-login-template';
  displayedColumns: string[] = ['id', 'name', 'action'];
  // dataSource = ELEMENT_DATA;
  databaseName: any = ''
  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;
  loading: any = false;
  // router: string;
  constructor(public dialog: MatDialog, public _router: Router, private appService: AppService, private cdr: ChangeDetectorRef,  private ngZone: NgZone) {
    // this.router = _router.url; 
    // console.log(this.router)
    this.appService.loader$.subscribe((loader) => {
      //console.log(nickname, 'jj')
      this.ngZone.run(() => {
        this.loading = loader ? loader : false;
      //this.cdr.detectChanges();
      });
      
    });

  }

  ngOnInit() {
    if (environment.apiUrl == 'https://adminapi.nukhba.com/api/v1') {
      this.databaseName = 'Live'
    } else {
      this.databaseName = 'Beta'
    }
  }

  change_nav() {
    
    if (this.isExpanded) {
      this.klass_nav = "closed-nav"
    } else {
      this.klass_nav = "open-nav"
    }
    this.isExpanded = !this.isExpanded
  }

  adminLogout() {
    const dialogRef = this.dialog.open(ConfirmLogoutComponent, {
      hasBackdrop: false,
      width: '40%',
      height: '30%',
    });
    dialogRef.afterClosed().subscribe(result => {
     
    });
  }
}
