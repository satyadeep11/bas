import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private manager = new BehaviorSubject('');
  private admin = new BehaviorSubject(false);
  private userdata= new BehaviorSubject([]);
  currentManager = this.manager.asObservable();
  currentAdmin = this.admin.asObservable();
  currentUserdata=this.userdata.asObservable();

  constructor() { }

  changeMessage(sk) {
    this.manager.next(sk);
    sessionStorage.setItem("mgrlgn",JSON.stringify(sk));
  }

  changeAdmin(loggedin: boolean) {
    this.admin.next(loggedin);
    // sessionStorage.setItem("admin",JSON.stringify(loggedin));
  }

  changeUserdata(userdata: any[]) {
    this.userdata.next(userdata);
    sessionStorage.setItem("ud",JSON.stringify(userdata));
  }

}