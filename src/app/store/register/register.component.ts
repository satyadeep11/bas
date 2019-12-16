import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from "../../../app/api.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
    loading = false;
    submitted = false;
    loginurl='';
    private sub: any;
    site='';
    sites=["site1","site2","site3"];
    domain=localStorage.getItem("loginoption").includes("Domain");
    code=localStorage.getItem("loginoption").includes("Code");
    domainvalue=localStorage.getItem("domainname");

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private apiService: ApiService,
        // private authenticationService: AuthenticationService,
        // private userService: UserService,
        // private alertService: AlertService
    ) { 
          // redirect to home if already logged in
        // if (this.authenticationService.currentUserValue) { 
        //     this.router.navigate(['/']);
        // }
    }

    ngOnInit() {
      this.sub = this.route.params.subscribe(params => {
        this.site=params['id'];     
        this.loginurl='/stores/'+this.site+'/login';
        if(this.site){        
          if(localStorage.getItem("storeid")){          
            var url="/stores/"+this.site+"/register";
            this.router.navigate([url]);          
          }else{
            alert("No Such Site with name "+ this.site.toUpperCase() +" available");
            this.router.navigate(['/stores']);
          }
        }  
        else{
          this.router.navigate(['/stores']);
        }
        console.log(this.site);
      });

      if(this.domain){
        this.registerForm = this.formBuilder.group({
          fname: ['', Validators.required],
          lname: ['', Validators.required],
          phone: ['', Validators.required],
          email: ['', [Validators.required,Validators.pattern("^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?"+localStorage.getItem("domainname")+"$")]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmpassword: ['', [Validators.required, Validators.minLength(6)]],
      });
      }
      else if(this.code){
        this.registerForm = this.formBuilder.group({
          fname: ['', Validators.required],
          lname: ['', Validators.required],
          email: ['', Validators.required],
          phone: ['', Validators.required],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmpassword: ['', [Validators.required, Validators.minLength(6)]],
          code: ['', [Validators.required, Validators.pattern("^"+localStorage.getItem("accesscode")+"$")]],
      });
      }
       
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        else{
          var finaldata=({ storeid:localStorage.getItem("storeid"),userdata:this.registerForm.value});
          console.log(finaldata);
          this.apiService.empregistration(finaldata).subscribe(
            user => {
              console.log(user);
              if(user["error"]){
                alert("An account already exists with used email, login or use another email");
              }
              if(!user["error"]){
                alert("Account created successfully. Please Login.");
                this.router.navigate(['/stores/'+this.site+'/login']);
              }
            },
            error => console.log(error)
          );
        }
        this.loading = true;
        // this.userService.register(this.registerForm.value)
        //     .pipe(first())
        //     .subscribe(
        //         data => {
        //             this.alertService.success('Registration successful', true);
        //             this.router.navigate(['/login']);
        //         },
        //         error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });
    }
}
