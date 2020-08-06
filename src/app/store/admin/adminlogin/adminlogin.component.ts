import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from "../../../../app/api.service";
import { DataService } from "../../../data.service";

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.scss']
})
export class AdminloginComponent implements OnInit {
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
  loadComponent=false;
  

  constructor(private route: ActivatedRoute, private apiService: ApiService,private formBuilder: FormBuilder,private router: Router, private data: DataService) { 
    this.sub = this.route.params.subscribe(params => {
      this.site=params['id'];     
      this.home="/stores/"+this.site;

      this.apiService.checkSite(this.site).subscribe(
        user => {
          if(!(user["error"])){ 
         this.storeid=user.sitedata[0].StoreID; 
        }
        else{
          sessionStorage.clear();
          alert("No Such Site with name "+ this.site +" available");
          this.router.navigate(['/stores']);
        }
        }
         );      

      if(sessionStorage.getItem("mgrlgn")=="true"){
        var url="/stores/"+this.site+"/admin";
          this.router.navigate([url]);  
      }
    });

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
      this.apiService.mgrlogin(finaldata).subscribe(
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
          var sk=this.storeid*5+(this.site.charCodeAt(1))*11+(this.site.charCodeAt(this.site.length-1))*1987;
          console.log(sk);
            this.data.changeMessage(sk);   
            console.log(user.ud)            
            this.data.changeUserdata(user.ud);  
            sessionStorage.setItem("md", JSON.stringify(user["md"]));
            // alert("Login Successful, you will be redirected.");
            this.router.navigate(['/stores/'+this.site+'/admin']);
          } 
        },
        error => console.log(error)
      );
    }
    
}

}
