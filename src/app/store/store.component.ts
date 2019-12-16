import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from "../../app/api.service";
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
  returnUrl: string;
  site='';
  sites=["site1","site2","site3"];
  fourofour=false;

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }
  constructor(private route: ActivatedRoute,
    private titleService: Title,
    private apiService: ApiService,
    private formBuilder: FormBuilder,private router: Router) { 
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
        this.router.navigate(['/stores']);
        }
      }
      else{
        this.router.navigate(['/stores']);
      }
    });
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      storename: ['', Validators.required]      
  });
  }

  get f() { return this.loginForm.controls; }

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
      //     this.router.navigate(['/stores']);
      //   }
      // }
      // else{
      //   this.router.navigate(['/stores']);
      // }

      this.apiService.checkSite(this.f.storename.value).subscribe(
        user => {
         var myData = user; 
         console.log(myData) 
         if(myData){        
          this.site=this.f.storename.value;
           console.log(myData);
          
            if(!(myData["error"])){          
              var url="/stores/"+this.site;
              this.router.navigate([url]);   
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
              this.router.navigate(['/stores']);
            }
          }
          else{
            this.router.navigate(['/stores']);
          }
         
        },
        error => console.log(error)
      );
    }
}
  
}
