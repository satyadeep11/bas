import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from "../../../app/api.service";
import { DataService } from "../../data.service";

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {
  private sub: any;
  id:any;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  site='';
  registerurl='';
  access=false;
  home;
  storeid;
  lgn=false;
  
  constructor(private route: ActivatedRoute, private apiService: ApiService,private formBuilder: FormBuilder,private router: Router, private data: DataService) {
    this.data.currentAdmin.subscribe(message => this.lgn=message);
    if(sessionStorage.getItem("adminlgn")=="false"){ 
      // if(this.lgn){ 
      // return;
      // }
      // else{
      //   sessionStorage.removeItem("adminlgn"); 
      //   this.router.navigate(['/superadmin/login']);
      // }
    }
    else if(this.lgn){
      sessionStorage.setItem("adminlgn",JSON.stringify(this.lgn));
      this.router.navigate(['/superadmin']);
    }
    else if(sessionStorage.getItem("adminlgn")=="true"){
      this.router.navigate(['/superadmin']);
    }
   }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
  });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    else{
    var finaldata=({storeid:this.storeid,userdata:this.loginForm.value});
      this.apiService.adminlogin(finaldata).subscribe(
        user => {
          console.log(user);
          if(user["error"]){
            alert("No account with email "+ this.f.email.value);
          }
          if(!user["error"]){
          // //  localStorage.setItem("storemanagerid", (user["md"]["StoreManagerID"]));
          //   // localStorage.setItem("storeid", (user["md"]["StoreID"]));
          //   localStorage.setItem("ud", JSON.stringify(user["ud"]));
          //   // console.log(localStorage.getItem("ud"))
            this.data.changeAdmin(true);   
            console.log(user.ud)            
            this.data.changeUserdata(user.ud);  
            alert("Login Successful, you will be redirected.");
            this.router.navigate(['/superadmin']);
          }
        },
        error => console.log(error)
      );
    }
    
}
}
