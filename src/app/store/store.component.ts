import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from "../../app/api.service";
import { DataService } from "../../app/data.service";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  private sub: any;
  id:any;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  asubmitted = false;
  returnUrl: string;
  site='';
  sites=["site1","site2","site3"];
  fourofour=false;
  toadmin=0;
  adminlgn=false;
  adminloginForm: FormGroup;
  storeid=0;
  loadComponent=false;

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }
  constructor(private route: ActivatedRoute,
    private titleService: Title,
    private apiService: ApiService,
    private formBuilder: FormBuilder,private router: Router, private data: DataService) { 
      this.setTitle( 'Sign In | Build-A-Gift Store' );
  //   this.router.routeReuseStrategy.shouldReuseRoute = function() {
  //     return false;
  // };
    this.sub = this.route.params.subscribe(params => {
      this.site=params['id'];
      if(this.site){
        console.log(this.site);
        if(this.sites.includes(this.site)){
          var url="/stores/"+this.site+"/login";
          this.router.navigate([url]);
        }else{
        this.router.navigate(['/sign-in']);
        }
      }
      else{
        this.router.navigate(['/sign-in']);
      }
    });
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      storename: ['', Validators.required]      
  });
  this.adminloginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
});
  }

  get f() { return this.loginForm.controls; }
  get af() { return this.adminloginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      console.log(this.loginForm.invalid)
        return;
    }
    else{
      // this.site=this.f.storename.value;
      // if(this.site){        
      //   if(this.sites.includes(this.site)){          
      //     var url="/stores/"+this.site+"/login";
      //     this.router.navigate([url]);          
      //   }else{
      //     alert("No Such Site with name "+ this.site +" available");
      //     this.router.navigate(['/sign-in']);
      //   }
      // }
      // else{
      //   this.router.navigate(['/sign-in']);
      // }

      this.apiService.checkSite(this.f.storename.value).subscribe(
        user => {
          
         var myData = user; 
         console.log(myData) 
         if(myData){        
          this.site=this.f.storename.value;          
           console.log(myData);
          
            if(!(myData["error"])){       
              this.storeid=user.sitedata[0].StoreID;    
              var url="/stores/"+this.site;
              var adminurl="/stores/"+this.site+"/admin";
              if(this.toadmin==1){
                this.adminlgn=true;
              }
              else{
                this.router.navigate([url]);
              }
           
              // localStorage.setItem("giftlogo", myData.sitedata.find(o => o.Settingcontrol === 'giftlogo').SettingValue);
              // localStorage.setItem("logoimage", myData.sitedata.find(o => o.Settingcontrol === 'logoimage').SettingValue);
              // localStorage.setItem("reason",myData.sitedata.find(o => o.Settingcontrol === 'reason').SettingValue);
              // localStorage.setItem("storename", myData.sitedata.find(o => o.Settingcontrol === 'storename').SettingValue);
              // localStorage.setItem("shipping", myData.sitedata.find(o => o.Settingcontrol === 'shipping').SettingValue);
              // localStorage.setItem("bannerimage", myData.sitedata.find(o => o.Settingcontrol === 'bannerimage').SettingValue);
              // localStorage.setItem("bannerheading", myData.sitedata.find(o => o.Settingcontrol === 'bannerheading').SettingValue);
              // localStorage.setItem("bannerdesc", myData.sitedata.find(o => o.Settingcontrol === 'bannerdesc').SettingValue);
              // localStorage.setItem("loginoption", myData.sitedata.find(o => o.Settingcontrol === 'loginoption').SettingValue);
              // localStorage.setItem("domainname", myData.sitedata.find(o => o.Settingcontrol === 'domainname').SettingValue);
              // localStorage.setItem("accesscode", myData.sitedata.find(o => o.Settingcontrol === 'accesscode').SettingValue);
              // localStorage.setItem("storeurl",myData.sitedata[0].StoreUrl);
              // localStorage.setItem("storeid",myData.sitedata[0].StoreID);
//console.log(giftlogo,logoimage,reason,storename,empshipping,bannerimage,bannerheading,bannerdesc,storename,storeurl,storeid)
// localStorage.setItem("selections",

            }else{
              alert("No Such Site with name "+ this.site +" available");
              this.router.navigate(['/sign-in']);
            }
          }
          else{
            this.router.navigate(['/sign-in']);
          }
         
        },
        error => console.log(error)
      );
    }
}

onadminSubmit() {
  this.asubmitted = true;

  // stop here if form is invalid
  if (this.adminloginForm.invalid) {
      return;
  }
  else{
  var finaldata=({storeid:this.storeid,userdata:this.adminloginForm.value});
    this.apiService.mgrlogin(finaldata).subscribe(
      user => {
        console.log(user);
        if(user["error"]){
          alert("No account with email "+ this.af.email.value);
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
