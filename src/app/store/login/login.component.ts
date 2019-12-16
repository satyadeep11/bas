import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from "../../../app/api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private sub: any;
  id:any;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  site='';
  registerurl='';
  sites=["site1","site2","site3"];
  access=false;
  constructor(private route: ActivatedRoute, private apiService: ApiService,private formBuilder: FormBuilder,private router: Router) {

    this.sub = this.route.params.subscribe(params => {
      this.site=params['id'];     
      this.registerurl='/stores/'+this.site+'/register';
      if(this.site && !this.access){        
        if(localStorage.getItem("giftlogo")){          
          var url="/stores/"+this.site+"/login";
          this.router.navigate([url]);          
        }else{
          alert("No Such Site with name "+ this.site.toUpperCase() +" available");
          this.router.navigate(['/stores']);
        }
      }
      else if (this.access){
        
        var url1="/stores/"+this.site+"/home";
        this.router.navigate([url1]);
      }
      else{
        this.router.navigate(['/stores']);
      }
      console.log(this.site);
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
    var finaldata=({storeid:localStorage.getItem("storeid"),userdata:this.loginForm.value});
      this.apiService.emplogin(finaldata).subscribe(
        user => {
          console.log(user);
          if(user["error"]){
            alert("No account with email "+ this.f.email.value);
          }
          if(!user["error"]){
            localStorage.setItem("storeuserid", (user["ud"]["StoreUserID"]));
            alert("Login Successful, you will be redirected.");
            this.router.navigate(['/stores/'+this.site+'/home']);
          }
        },
        error => console.log(error)
      );
    }
    
}
}
