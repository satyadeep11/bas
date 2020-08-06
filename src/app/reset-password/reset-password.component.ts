import { Component, OnInit } from '@angular/core';
import { ApiService} from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  myData:any;
  public uuid:string;
  public email:string;
  model: userPassword ={uuid:'',email:'',password:'',password2:''};//get form control


  constructor(public router: Router,private resetService: ApiService) { }

  ngOnInit() { 
    var url_string = window.location.href; //window.location.href
      var url = new URL(url_string);
      this.email = url.searchParams.get("email");
      this.uuid = url.searchParams.get("uuid");
      console.log(this.uuid);
      if(!this.email && !this.uuid){   
        alert("Error!")   
        this.router.navigateByUrl('/');
      }
  }

  resetPassword(person: userPassword){
    person.uuid=this.uuid;
    person.email=this.email;
    this.resetService.reset(person)
    .subscribe(user => {
      // show an alert to tell the user if product was created or not
      console.log(user);
      // go back to list of products
      this.myData = user; 
      if(this.myData.error){
        alert("Error!")  
        this.router.navigateByUrl('/');
      }
      else if(this.myData.user.admin==0){
        // localStorage.setItem('isLoggedin', 'true');
        // localStorage.setItem('fname', this.myData.user.fname);
        // localStorage.setItem('lname', this.myData.user.lname);
        // localStorage.setItem('securityGroup', this.myData.user['security_group']);
        if(window.confirm('Password Changed. ')){
          this.router.navigateByUrl('/stores');
          }
          else this.router.navigateByUrl('/');
        
      }
      else if(this.myData.user.admin==1){
        // localStorage.setItem('isLoggedin', 'true');
        // localStorage.setItem('admin', 'true');
        // localStorage.setItem('fname', this.myData.user.fname);
        // localStorage.setItem('lname', this.myData.user.lname);        
        // localStorage.setItem('securityGroup', this.myData.user['security_group']);
        if(window.confirm('Password Changed. You will be redirected to the Login Page.')){
          this.router.navigateByUrl('/superadmin/login');
          }
          else this.router.navigateByUrl('/');
      }      
   },
   error => console.log(error)
  );
  }

}


export interface userPassword {
  uuid: string,
  email: string,
 password: string,
 password2: string
 }





