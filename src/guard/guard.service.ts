import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
@Injectable({
  providedIn: "root",
})
export class AdminGuardService implements CanActivate {
  constructor(
    public router: Router,
  ) { }
  ngOnInit() { }

  canActivate(): boolean {
    const admin = localStorage.getItem('authtoken');
    if (!admin || admin.length == 0) {
      this.router.navigateByUrl("/");
      return false;
    } else {
      return true;
    }
  }
}
