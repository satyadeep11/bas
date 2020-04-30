import { Component, OnInit, Input  } from '@angular/core';
import { ApiService } from "../../../app/api.service";
import { FormBuilder,  FormGroup,  FormArray,  FormControl,  Validators } from "@angular/forms";

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  childData:any;
  formdata:any;
  creditcardshow=false;
  storename=localStorage.getItem("storename");
  bannerheading=localStorage.getItem("bannerheading");
  bannerdesc=localStorage.getItem("bannerdesc");
  bannerimage=localStorage.getItem("bannerimage");
  reason=localStorage.getItem("reason");
  uniqueprods;
  baseurl= window.location.hostname.includes("localhost")?"http://localhost":"";
  constructor( private apiService: ApiService,private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.apiService.currentMessage.subscribe(message => this.childData = message); 
    this.childData=JSON.parse(localStorage.getItem("selections"));
    this.uniqueprods = this.childData.filter((thing, index, self) =>
    index === self.findIndex((t) => (
      t.ProductID === thing.ProductID
    ))
  )
    
    this.formdata=JSON.parse(localStorage.getItem("formdata"));
    console.log(this.formdata.storeurl)
    this.apiService.checkSite(this.formdata.storeurl).subscribe(
      user => {
       var myData = user; 
       console.log(myData) 
       if(myData){        
         console.log(myData);        
          if(!(myData["error"])){ 
            localStorage.setItem("giftlogo", myData.sitedata.find(o => o.Settingcontrol === 'giftlogo').SettingValue);
            localStorage.setItem("logoimage", myData.sitedata.find(o => o.Settingcontrol === 'logoimage').SettingValue);
            localStorage.setItem("reason",myData.sitedata.find(o => o.Settingcontrol === 'reason').SettingValue);
            localStorage.setItem("storename", myData.sitedata.find(o => o.Settingcontrol === 'storename').SettingValue);
            localStorage.setItem("shipping", myData.sitedata.find(o => o.Settingcontrol === 'shipping').SettingValue);
            localStorage.setItem("bannerimage", myData.sitedata.find(o => o.Settingcontrol === 'bannerimage').SettingValue);
            localStorage.setItem("bannerheading", myData.sitedata.find(o => o.Settingcontrol === 'bannerheading').SettingValue);
            localStorage.setItem("bannerdesc", myData.sitedata.find(o => o.Settingcontrol === 'bannerdesc').SettingValue);
            localStorage.setItem("loginoption", myData.sitedata.find(o => o.Settingcontrol === 'loginoption').SettingValue);
            localStorage.setItem("domainname", myData.sitedata.find(o => o.Settingcontrol === 'domainname').SettingValue);
            localStorage.setItem("accesscode", myData.sitedata.find(o => o.Settingcontrol === 'accesscode').SettingValue);
            localStorage.setItem("storeurl",myData.sitedata[0].StoreUrl);
            localStorage.setItem("storeid",myData.sitedata[0].StoreID);
//console.log(giftlogo,logoimage,reason,storename,empshipping,bannerimage,bannerheading,bannerdesc,storename,storeurl,storeid)
// localStorage.setItem("selections",
this.storename=localStorage.getItem("storename");
this.bannerheading=localStorage.getItem("bannerheading");
this.bannerdesc=localStorage.getItem("bannerdesc");
this.bannerimage=localStorage.getItem("bannerimage");
this.reason=localStorage.getItem("reason");
var filename= this.bannerimage.replace(/^.*[\\\/]/, '');
this.bannerimage=this.baseurl+"/php_api/uploads/"+this.formdata.storeurl+"-bannerimage-"+filename;

          }
        }
        
       
      },
      error => console.log(error)
    );
  }

  showCreditcard(){
    this.creditcardshow=true;
  }
}
