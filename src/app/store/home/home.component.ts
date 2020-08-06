import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from "../../../app/api.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from "../../data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  @ViewChild("headline",{static:false}) headline: ElementRef;
  fullName: string = "Hello JavaTpoint";    
  private sub: any;
  id:any;
  address: FormGroup;
  loading = false;
  loadingspinner= false;
  submitted = false;
  returnUrl: string;
  storeurl=''
  homeurl='';
  site='';
  registerurl='';
  sites=["site1","site2","site3"];
  access=false;
  myData: any; 
  seeselection= Array();
  uniqueprods=Array();
  selection = [];
  modalReference: any;
  products:any;
  finalcheckout=false;
  pselect:any;
  empaddress=false;
  addresses;
  showshipping=false;
  productdata:any;
  addressdata=[];
  hideaddaddress=false;
  successclass=[];
  successful=false;
  storename;
  bannerheading;
  bannerdesc;
  bannerimage;
  logoimage;
  reason;
  domain;
  code;
  registerForm: FormGroup; 
  pending=0;
  baseurl= window.location.hostname.includes("localhost")?"http://localhost":"";
  loginForm: FormGroup;
  domainname;
  accesscode;
  welcome=true;
  home=false;
  checkout=false;
  uname="";
  pword="";
  storedata;
  storeclose;
  storeid;
  companyname;
  toggled="";
  mgrlogin=false;
  mgrname;
  mgremail;
  tempbannerimage;
  tempbannername;
  templogoimage;
  templogoname;
  theme="";
  dupemail=false;
  preautherrors=false;
  addresserrors=false;
  registrationerrors=false;
  adminurl;
  admin=false;
  nologo=false;
  templogo;
  templogonamebup;
  nobanner=false;
  tempbanner;
  tempbannernamebup;
  transparentbg=true; 
  textcolor="#ffffff";
  textcolorbup;
  uploadResponse = { status: '', message: '', filePath: '' };
  error;
  bgimage="";
  primarycolor="#53565A";
  buttoncolor="#e00000";
  btntextcolor='';
  storenamefont="Open Sans";
  mainheadlinefont="'Bai Jamjuree', sans-serif"; 
  subheadlinefont="'Bai Jamjuree', sans-serif"; 
  bodyfont="Open Sans";
  transparentbgbup;
  ie = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
  contactemail;
  contactphone;
  saddress
  padd=false;
  nosuggested=false;

  constructor(private data: DataService,private modalService: NgbModal,private route: ActivatedRoute,private formBuilder: FormBuilder,private router: Router,private apiService: ApiService,) {
    this.loading=true;
    this.sub = this.route.params.subscribe(params => {
      this.site=params['id'];  
      this.uname=params['uid'];  
      this.pword=params['pwd'];   
      console.log( this.baseurl);
      console.log(this.site,this.uname,this.pword); 
      
      this.storeurl='/stores/'+this.site; 
      this.homeurl= this.storeurl+'/home'
      this.adminurl=this.storeurl+'/admin';
      // this.registerurl='/stores/'+this.site+'/register';
      // if(this.site && !this.access){        
      //   if(this.sites.includes(this.site)){          
      //     var url="/stores/"+this.site+"/login";
      //     this.router.navigate([url]);          
      //   }else{
      //     alert("No Such Site with name "+ this.site.toUpperCase() +" available");
      //     this.router.navigate(['/stores']);
      //   }
      // }
      // else if (this.access){
      //   var url1="/stores/"+this.site+"/home";
      //   this.router.navigate([url1]);
      // }
      // else{
      //   this.router.navigate(['/stores']);
      // }
      // console.log(this.site);
    });

    this.loginForm = this.formBuilder.group({
      email: [""],
      access: [""]
    });

    if(sessionStorage.getItem("mgrlgn")===null||sessionStorage.getItem("mgrlgn")==""){
      sessionStorage.clear();
      console.log("asda")
      // var logcheck;
      // this.data.currentManager.subscribe(message => logcheck=message);   
      // if(!logcheck){
      //   var url="/stores/"+this.site+"/admin/login";
      //   this.router.navigate([url]);          
      // }
    } 

    

    if(localStorage.getItem("adminlgn")=="true"){
      console.log("admin")
      this.mgrlogin=true;
        this.toggled="toggled";
        this.welcome=false;
        this.home=true;
        this.admin=true;
    }
    else{
      console.log("not admin")
    }

    // var logcheck;
    // this.data.currentManager.subscribe(message => logcheck=message);   
    // if(logcheck){
    //   this.mgrlogin=true;
    //   this.toggled="toggled";
    //   this.welcome=false;
    //   this.home=true;
    // }
    

     this.apiService.checkSite(this.site).subscribe(
        user => {
          console.log(user)
          if(user["error"]){
            sessionStorage.clear();
            alert("No Such Site with name "+ this.site +" available");
          this.router.navigate(['/stores']);
          }
          this.storeid=user.sitedata[0].StoreID?user.sitedata[0].StoreID:0; 
         var sk=this.storeid*5+(this.site.charCodeAt(1))*11+(this.site.charCodeAt(this.site.length-1))*1987;
         if(parseInt(sessionStorage.getItem("mgrlgn"))!=sk){
           sessionStorage.clear();
           var url="/stores/"+this.site+"/home";
                     this.router.navigate([url]);
         }

         if(parseInt(sessionStorage.getItem("mgrlgn"))==sk){
          this.mgrlogin=true;
            this.toggled="toggled";
            this.welcome=false;
            this.home=true;
        }
         this.storedata = user; 
         
        //  console.log(myData) 
         if(this.storedata){        
        console.log(this.storedata);
          
            if(!(this.storedata["error"])){          
              // var url="/stores/"+this.site+"/home";
              // this.router.navigate([url]);   
                this.loading=false;
                this.logoimage=this.storedata.sitedata.find(o => o.Settingcontrol === 'logoimage').SettingValue;
                if(this.logoimage){
                  this.logoimage=this.logoimage.replace(/ /g,"_");
                  this.templogoname=this.logoimage;
                  this.logoimage =this.baseurl+"/php_api/uploads/"+this.site +"-logoimage-"+this.logoimage.replace(/^.*[\\\/]/, '');
                }
                else{
                  this.templogoname="";
                  this.logoimage ="";
                  this.nologo=true;
                }        
                this.primarycolor=(this.storedata.sitedata.find(o => o.Settingcontrol === 'primarycolor')?this.storedata.sitedata.find(o => o.Settingcontrol === 'primarycolor').SettingValue:"");       
                this.buttoncolor=(this.storedata.sitedata.find(o => o.Settingcontrol === 'buttoncolor')?this.storedata.sitedata.find(o => o.Settingcontrol === 'buttoncolor').SettingValue:"");       
                this.textcolorbup=this.textcolor=(this.storedata.sitedata.find(o => o.Settingcontrol === 'textcolor')?this.storedata.sitedata.find(o => o.Settingcontrol === 'textcolor').SettingValue:"#ffffff");       
                this.transparentbgbup=this.transparentbg=this.storedata.sitedata.find(o => o.Settingcontrol === 'transparentbg')?((this.storedata.sitedata.find(o => o.Settingcontrol === 'transparentbg').SettingValue)==1?true:false):false;    
                this.nobanner=this.storedata.sitedata.find(o => o.Settingcontrol === 'nobanner')?((this.storedata.sitedata.find(o => o.Settingcontrol === 'nobanner').SettingValue)==0?true:false):false;  
                this.reason=this.storedata.sitedata.find(o => o.Settingcontrol === 'reason').SettingValue;
                this.storename=this.storedata.sitedata.find(o => o.Settingcontrol === 'storename').SettingValue;
                this.companyname=this.storedata.sitedata.find(o => o.Settingcontrol === 'cname').SettingValue;
                this.contactemail=this.storedata.sitedata.find(o => o.Settingcontrol === 'contactemail').SettingValue;
                this.contactphone=this.storedata.sitedata.find(o => o.Settingcontrol === 'contactphone').SettingValue;
                console.log(this.contactphone)
                this.contactphone=this.formatPhoneNumber(this.contactphone);
                console.log(this.contactphone)
               this.bannerimage=this.storedata.sitedata.find(o => o.Settingcontrol === 'bannerimage').SettingValue;
               if(this.bannerimage){
                this.nobanner=false;
                this.bannerimage=this.bannerimage.replace(/ /g,"_");
                this.tempbannername=this.bannerimage;
                this.bannerimage =this.baseurl+"/php_api/uploads/"+this.site +"-bannerimage-"+this.bannerimage.replace(/^.*[\\\/]/, '');
               }
               else{
                this.tempbannername="";
                this.bannerimage="";
                // this.bannerimage =this.baseurl+"/php_api/uploads/default-banner.png";
               }               
                this.bannerheading=this.storedata.sitedata.find(o => o.Settingcontrol === 'bannerheading').SettingValue;
                this.bannerdesc=this.storedata.sitedata.find(o => o.Settingcontrol === 'bannerdesc').SettingValue;
                var loginoption=this.storedata.sitedata.find(o => o.Settingcontrol === 'loginoption').SettingValue;
                this.domain=loginoption.toLowerCase().includes("email");
                this.code=loginoption.toLowerCase().includes("code");
                this.code=true;
                console.log(loginoption,this.domain,this.code,"xx")
                this.domainname=this.storedata.sitedata.find(o => o.Settingcontrol === 'domainname').SettingValue;
                this.accesscode=this.storedata.sitedata.find(o => o.Settingcontrol === 'accesscode').SettingValue;
                this.storeclose=this.storedata.sitedata.find(o => o.Settingcontrol === 'enddate').SettingValue;
                this.theme=this.storedata.sitedata.find(o => o.Settingcontrol === 'theme').SettingValue||'Default';   
                this.themechange(this.theme);             
                // this.storeclose= new Date(this.storeclose).toDateString();
                var options = {year: 'numeric', month: 'long', day: 'numeric' };
                // this.storeclose=new Date(this.storeclose).toLocaleDateString("en-US", options);
              
                // localStorage.setItem("storeurl",myData.sitedata[0].StoreUrl);
                this.storeid=this.storedata.sitedata[0].StoreID;
                //console.log(giftlogo,logoimage,reason,storename,empshipping,bannerimage,bannerheading,bannerdesc,storename,storeurl,storeid)
                // localStorage.setItem("selections",
              if(this.uname){
                    
                var finaldata=({storeid:this.storeid,userdata:{email:this.uname,password:this.pword}});
                console.log(finaldata,"here")
                this.apiService.mgrlogin(finaldata).subscribe(
                  user => {
                    console.log(user);
                    if(user["error"]){
                      alert("Account Verfication Error");
                      this.router.navigate(['/stores/'+this.site]);
                    }
                    if(!user["error"]){
                      // localStorage.setItem("storemanagerid", (user["md"]["StoreManagerID"]));
                      // localStorage.setItem("storeid", (user["md"]["StoreID"]));
                      var sk=this.storeid*5+(this.site.charCodeAt(1))*11+(this.site.charCodeAt(this.site.length-1))*1987;
          console.log(sk);
            this.data.changeMessage(sk);   
            console.log(user.ud)            
            this.data.changeUserdata(user.ud);  
                       sessionStorage.setItem("ud", JSON.stringify(user["ud"]));
                      console.log("success");
                      this.mgrlogin=true;
                      this.toggled="toggled";
                      this.welcome=false;
                      this.home=true;
                      this.mgrname=user["ud"]["Firstname"]+ " "+ user["ud"]["Lastname"];
                      this.mgremail=user["ud"]["Username"];
                      // alert("Login Successful, you will be redirected.");
                      // this.router.navigate(['/stores/'+this.site+'/admin']);
                    }
                  },
                  error => console.log(error)
                );

              }

              this.apiService.shipsettings(this.storeid).subscribe(
                user => {
                  console.log(user); 
                  (user.shipping.empshipsetting=="Recipients can choose from a corporate address or enter their home address"||user.shipping.empshipsetting=="To the recipient's home address")?this.empaddress=true:this.empaddress=false; 
                  if(user.shipping.empshipsetting=="To a corporate address"||user.shipping.empshipsetting=="Recipients can choose from a corporate address or enter their home address"){
                    this.addresses=user.shipping.addressess;
                  } 
                  else{
                    this.addresses=Array();
                    this.showshipping=true;
                    this.padd=true;
                  }                 
                  console.log(this.empaddress,this.addresses);    
                  if(this.empaddress){
                    this.address = this.formBuilder.group({
                      type:['P'],
                      cost:[10],
                      main:[0],
                      addressname: ["", Validators.required],
                      streetaddress: ["", [Validators.required]],
                      streetaddress2: [""],
                          city: ["", [Validators.required]],
                          state: ["", [Validators.required]],
                          zip: [
                            "",
                            [
                              Validators.required,
                              Validators.pattern("^[0-9]{5}(?:-[0-9]{4})?$")
                            ]
                          ]
                  });
                    }
                    
    if(this.domain){
      this.registerForm = this.formBuilder.group({
        fname: ['', Validators.required],
        lname: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', [Validators.required,this.validateEmail.bind(this)]],
        // password: ['', [Validators.required, Validators.minLength(6)]],
        // confirmpassword: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.formControlValueChanged();
    }
    else if(this.code){
      this.registerForm = this.formBuilder.group({
        fname: ['', Validators.required],
        lname: ['', Validators.required],
        email: ['', Validators.required],
        phone: ['', Validators.required],
        // password: ['', [Validators.required, Validators.minLength(6)]],
        // confirmpassword: ['', [Validators.required, Validators.minLength(6)]],
        code: ['', [Validators.pattern("^"+this.accesscode+"$")]],
    });
    this.formControlValueChanged();
    }
                },
                error => console.log(error)
              );

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

formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return null
  }

hexToLuma() {
    const hex   = this.buttoncolor.replace(/#/, '');
    const r     = parseInt(hex.substr(0, 2), 16);
    const g     = parseInt(hex.substr(2, 2), 16);
    const b     = parseInt(hex.substr(4, 2), 16);
var x=[
  0.299 * r,
  0.587 * g,
  0.114 * b
].reduce((a, b) => a + b) / 255;

if (x > 0.5)
this.btntextcolor="#000000";
else
this.btntextcolor="#ffffff";

};



  ngOnInit() {
    
    this.apiService.all_products().subscribe(
      user => {
        this.myData = Object.keys(user).map(e => user[e]);
        this.myData = this.mergeandflat(this.myData);
        console.log(this.myData); 
        this.getstoredata();
      },
      error => console.log(error)
    );    
    this.themechange(this.theme);

    if(this.bgimage){
      document.querySelector('#bannerbg')?document.querySelector('#bannerbg').removeAttribute("style"):'';
      var str="background:url('"+this.bgimage+"')";
      document.querySelector('#bannerbg')?document.querySelector('#bannerbg').setAttribute("style",str):'';
    }
  }

  formControlValueChanged() {
    console.log("damn1")
    if(this.registerForm){
    this.registerForm.controls.email.valueChanges.subscribe(
      (mode: string) => {
        this.dupemail=false;
        console.log("damn")
      });
    }
  }
  

validateEmail(c: FormControl) { 
  if(this){   
    return this.domainname.includes(c.value.replace(/.*@/, "")) ? null : {
      validateEmail: {
        valid: false
      }
    };
  } 
  }

  removestoreid(){
    localStorage.removeItem('storeid');
  }
  
  getstoredata(){
    this.apiService.getstoreproducts(this.storeid).subscribe(
      user => {
        if(user.products){
        this.selection=user.products;
        console.log(this.selection,"fromdb"); 
        this.createproductlist();
      }
      },
      error => console.log(error)
    );    
  }
  get f() { return this.registerForm.controls; }

  closeModal(){
    this.modalReference.close();
  }

  productdetails(modal,product){
    console.log(product);
    this.products=this.seeselection.filter(item => item.ProductID == product.ProductID); 
    console.log(product);
    this.productdata=this.selection.filter(item => item.productid == product.ProductID);    
    this.modalReference=this.modalService.open(modal, { centered: true,size:"lg" });
  }

  reset(){
    this.address.reset();
  }

  checkouts(pselect){
   
    this.home=false;
    this.checkout=true;
    this.closeModal();
    this.pselect=pselect;
    this.productdata=this.selection.filter(item => item.colorattr == pselect.Attr2);    
    console.log(this.productdata)
    window.scroll(0,0);
  }

  finalcheckouts(){
  if(this.mgrlogin){
    alert("Placing order is disabled during preview");
  }
else{
    // this.loading=true;
    this.registrationerrors = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
          console.log(this.registerForm)
            return;
        }
        else{
          this.loadingspinner=true;
          // console.log(this.registerForm.value)
    var finaldata=({storeid:this.storeid,userdata:this.registerForm.value , productdata: this.productdata, addressdata:this.addressdata,pending:this.pending});
    console.log(finaldata);
    console.log(this.addressdata);
    this.apiService.emporder(finaldata).subscribe(
      user => {        
        console.log(user,"fromdb"); 
        if(!user.error) {
          this.loading=false;
          this.checkout=false;
          this.successful=true;
          this.finalcheckout=!this.finalcheckout;
          this.addressdata=[];
          this.successclass=[];
          this.loadingspinner=false;
        }   
        else{
          this.dupemail=true;
          this.loadingspinner=false;
          console.log("here")
        }    
      },
      error => console.log(error)
    );  
  }
}
  }
  createproductlist(){
    this.seeselection=[];
    var copyData=this.myData;
  console.log(this.selection,this.myData)
    copyData.forEach((element,x) => {
      if (Array.isArray(element.ImageFile)) {        
        element.Attr2.forEach((a2id, i) => {    
          var z;      
          if(this.selection.some(function(o,f) {z=f;return o["colorattr"] == a2id;})){           
            var copyelement=JSON.parse(JSON.stringify(element));                      
            copyelement.ImageFile=element.ImageFile[i];
            copyelement.Attr2=element.Attr2[i];
            copyelement.A2_Label=element.A2_Label[i];//
            copyelement.Color=element.Color[i];//
            copyelement.custom_image=this.selection[z]["custom_image"];
            copyelement.custom_image_url=this.selection[z]["custom_image_url"];///check this************************
            this.seeselection.push(copyelement);//        
             
          }
        });
      }
      else{
        if(this.selection.some(function(o) {return o["colorattr"] == element.Attr2;})){   
          this.selection.forEach((prod,x) => {
            if(prod.productid==element.ProductID){
              element.custom_image=prod["custom_image"];
              element.custom_image_url=prod["custom_image_url"];  
            }            
          });             
          this.seeselection.push(element);
        }
      }      
    });
    
    this.uniqueprods = this.seeselection.filter((thing, index, self) =>
    index === self.findIndex((t) => (
      t.ProductID === thing.ProductID
    ))
  )
    
    console.log("here",this.selection,this.seeselection,this.uniqueprods);
    // this.apiService.changeMessage(this.seeselection);
    localStorage.setItem("selections", JSON.stringify(this.seeselection));
  }

  adselect(i,address){
    console.log(i,address)
    this.successclass=[];
    this.addressdata=[];
this.successclass[i]="text-black bg-secondary overridecolor";
this.finalcheckout=true;
this.addressdata.push(address);
!("AddressID" in address)?this.pending=1:this.pending=0;
console.log(this.pending);
  }

  onSubmit(addressmodal) {
    this.addresserrors = true;
    if (this.address.invalid) {
      return; 
  }
  else{
    this.loadingspinner=true;
    console.log(this.address)
    this.shiprocket(this.address.value,addressmodal);  
  }
  }

  shiprocket(address,addressmodal){  
    var self=this;
    var UPS_KEY = "0C8479FDBF9C0038";
    var UPS_USER = "ryanborn";
    var UPS_PASS = "idworks";
      var url = "https://api.rocketship.it/v1";
      var method = "POST";
      var postData = { "carrier": "UPS",
                        "action": "AddressValidate","params": {
                          "username": UPS_USER,
                          "password": UPS_PASS,
                          "key": UPS_KEY,
  
                          "to_name": address.addressname,
                          "to_addr1": address.streetaddress,
                          "to_addr2": address.streetaddress2,
                          "to_state": address.state,
                          "to_city": address.city,
                          "to_code": (address.zip).toString(),
                          "to_country": "US"
                        } 
                    };
      
      // You REALLY want shouldBeAsync = true.
      // Otherwise, it'll block ALL execution waiting for server response.
      var shouldBeAsync = true;    
      var request = new XMLHttpRequest();
      request.onload = function () {
        self.loadingspinner=false;
         var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
         var data = request.responseText; // Returned data, e.g., an HTML document.
         console.log(request.responseText);
         if(!JSON.parse(data).data.city_state_zip_match){
          if(JSON.parse(data).data.suggestions!=null){
           self.saddress=JSON.parse(data).data.suggestions;
           // self.saddress.addr2=self.saddress.addr2==''?self.dynamicForm.value["addressesarray"][i].streetaddress2:self.saddress.addr2;
           console.log(self.saddress,JSON.parse(data));
           self.nosuggested=false;
           self.openDialog(addressmodal);
          }else{
            self.nosuggested=true;
            self.openDialog(addressmodal);
          }
        }
        else{
          self.addresspush();
        } 
      }
      request.open(method, url, shouldBeAsync);
      request.setRequestHeader("Content-Type", "application/json");
      request.setRequestHeader("x-api-key", "9TipcqNm5542LB9IoPRJu7Ja3nwGF3Ne2ga71Zdg");    
      request.send(JSON.stringify(postData));
  
      
  }

  //Open Dialog
openDialog(formdone){
  this.modalReference=this.modalService.open(formdone, { centered: true });
}

updatesaddress(j){
console.log()
  this.address.controls.streetaddress.patchValue(this.saddress[j].addr1, {onlySelf: true});
  this.saddress[j].addr2=this.saddress[j].addr2==''?this.address.value.streetaddress2:this.saddress[j].addr2;
  this.address.controls.streetaddress2.patchValue(this.saddress[j].addr2, {onlySelf: true});
  this.address.controls.city.patchValue(this.saddress[j].city, {onlySelf: true});
  this.address.controls.state.patchValue(this.saddress[j].state, {onlySelf: true});
  this.address.controls.zip.patchValue(this.saddress[j].zipcode +'-'+ this.saddress[j].zipcode_addon, {onlySelf: true});


  this.address.value.streetaddress=(this.saddress[j].addr1);
  this.address.value.streetaddress2=(this.saddress[j].addr2);
  this.address.value.city=(this.saddress[j].city);
  this.address.value.state=(this.saddress[j].state);
  this.address.value.zip=(this.saddress[j].zipcode +'-'+ this.saddress[j].zipcode_addon);
 
  console.log(this.address.value);
this.addresspush();

}

addresspush(){
  //
  this.addresses.push(this.address.value);
    console.log(this.addresses,this.address.value);
    this.showshipping=false;
    this.hideaddaddress=true;
    this.addresserrors = false;
  //
  if(this.addresses.length==1){
    this.adselect(0,this.address.value)    
  }
  
  console.log(this.addressdata)
}

  mergeandflat(myData) {
    myData.forEach(element => {
      if (element.length > 1) {
        var output = [];

        //Iterating each element of the myData
        element.forEach(o => {
          //Checking the duplicate value and updating the data field
          let temp = output.find(x => {
            if (x && x.ProductID === o.ProductID) {
              const keys = Object.keys(x);
              for (const key of keys) {
                if (x[key] != o[key]) x[key] += "~" + o[key];
              }
              return true;
            }
          });
          if (!temp) output.push(o);
        });

        var index = myData.indexOf(element);
        if (index !== -1) {
          myData[index] = output;
        }
      }
    });
    //flat()=.reduce((acc, val) => acc.concat(val), [])
    myData.reduce((acc, val) => acc.concat(val), []).forEach(x => {
      const keys = Object.keys(x);
      for (const key of keys) {
        if (x[key] != null && x[key].includes("~"))
          x[key] = x[key].split("~").map(function(item) {
            return item.trim();
          });
      }
    });
    return myData.reduce((acc, val) => acc.concat(val), []);
  }

  preAuth() {
    var storeclosed=new Date(this.storeclose)
    var CurrentDate = new Date();
    if(storeclosed<CurrentDate){
      alert("Sorry. The store is closed");
      return;
    }
    console.log(this.loginForm.value);
    var home= "/stores/" + this.site +"/home" ;
    if (this.domain && this.loginForm.controls.email.value.length>0) {
      if (this.domainname.includes(this.loginForm.controls.email.value.replace(/.*@/, "")) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.loginForm.controls.email.value)) {
        this.home=true;
        this.welcome=false;
        window.scroll(0,0);
      }
      else{
        alert("Invalid Email")
      }
    }
    if (this.code) {
      if (this.accesscode.toLowerCase() == this.loginForm.controls.access.value.toLowerCase()){
        this.welcome=false;
        this.home=true;
        window.scroll(0,0);
      }else{
        alert("Invalid Access Code")
      }
    }
  }

 isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
  }

  nologooption(){
    if(this.nologo){
      this.templogonamebup=this.templogoname;
      this.templogoname='';
      this.templogo=this.logoimage;
      this.logoimage='';
    }
    else{      
      this.templogoname=this.templogonamebup;      
      this.logoimage=this.templogo;
    }
  }

  nobanneroption(){
    // if(this.nobanner){
    //   //off
    //   this.tempbannernamebup=this.tempbannername;
    //   this.tempbannername='';
    //   this.tempbanner=this.bannerimage;
    //   this.bannerimage='';
    //   document.querySelector('#bannerbg').removeAttribute("style");
    //   document.querySelector('#bannerbg').setAttribute("style","background-color:#53565a");
    //   console.log(this.tempbannernamebup,this.tempbannername,this.tempbanner,this.bannerimage)
    // }
    // else{    
    //   //on  
    //   this.tempbannername=this.tempbannernamebup;      
    //   this.bannerimage=this.tempbanner;
    //   document.querySelector('#bannerbg').setAttribute("style","background-size:cover");
    //   console.log(this.tempbannernamebup,this.tempbannername,this.tempbanner,this.bannerimage)
    // }
  }

  // textcolor(color){
  //   console.log(color)
  //   var headline="color:"+color+"!important;font-size: 5vw;";
  //   var subhead="color:"+color+"!important;font-size: 2.5vw;";
  //   document.querySelector('#headline').setAttribute("style",headline);
  //   document.querySelector('#sub-head').setAttribute("style",subhead);
  // }

  public fileChangeEvent(fileInput: any,type){
    if (fileInput.target.files && fileInput.target.files[0]) { 
      if(this.isFileImage(fileInput.target.files[0])){
      const formData = new FormData();
      var field;
      if(type=="logo"){
        this.templogoimage = fileInput.target.files[0];
        this.templogoname=fileInput.target.files[0].name;
        formData.append('logo', this.templogoimage);
        field ="logoimage-temp";
      }
      else if(type=="banner"){
        this.tempbannerimage = fileInput.target.files[0];
        this.tempbannername=fileInput.target.files[0].name;
        formData.append('logo', this.tempbannerimage);
        field ="bannerimage-temp";
      }
                
                formData.append('url', this.site);
                formData.append('field', field);
                this.apiService.uploadFile(formData).subscribe(
                  (res) => {
                     this.uploadResponse = res;
                      console.log(this.uploadResponse);
                      if(res.url){
                        console.log(this.baseurl+"/php_api/"+res.url);
                        if(type=="logo"){
                          this.logoimage=this.baseurl+"/php_api/"+res.url;
                        }
                        else if(type=="banner"){
                          this.bannerimage=this.baseurl+"/php_api/"+res.url;
                        }
                      }
                      

                  },
                  (err) => {  
                    this.error = err;
                    console.log(err);
                  }
                );
  }
  else{
    alert("Only Images please");
  }
}
}


logout(){
  this.data.changeMessage(false);
  sessionStorage.removeItem("mgrlgn");
  var url="/stores/"+this.site+"/admin/login";
  this.router.navigate([url]);  
}

submit(){
  if(this.bannerheading.length==0){
    alert("Headline Cannot be left empty!");  
    this.headline.nativeElement.focus();
    return;
  }
  if(this.templogoimage){
    const formData = new FormData();
        formData.append('logo', this.templogoimage);
        formData.append('url', this.site);
        formData.append('field', 'logoimage');
        this.apiService.uploadFile(formData).subscribe(
          (res) => {
            // this.uploadResponse = res;
              console.log(res);
          },
          (err) => {  
            console.log(err);
          }
        );
    }    
    if(this.tempbannerimage){
    const formData = new FormData();
        formData.append('logo', this.tempbannerimage);
        formData.append('url', this.site);
        formData.append('field', 'bannerimage');
        this.apiService.uploadFile(formData).subscribe(
          (res) => {
            // this.uploadResponse = res;
              console.log(res);
          },
          (err) => {  
            console.log(err);
          }
        );
      }
      this.tempbannername=this.tempbannername.replace(/ /g,"_");
      this.templogoname=this.templogoname.replace(/ /g,"_");
      var storedata=({logoimage:this.templogoname,bannerimage:this.tempbannername,bannerheading:this.bannerheading,bannerdesc:this.bannerdesc,reason:this.reason,theme:this.theme, transparentbg:(this.transparentbg?1:0),nobanner:(this.nobanner?0:1),textcolor:(this.textcolor),primarycolor:(this.primarycolor),buttoncolor:(this.buttoncolor)});
      var finaldata=({ storedata:  storedata , storeid:this.storeid});

      console.log(storedata,finaldata)

      this.apiService.mgrsettingsupdate(finaldata).subscribe(
        user => {
          console.log(user);
          if(user["error"]){
            alert("Something went Wrong. Contact Admin");
          }
          if(!user["error"]){
            alert("Hooray! Your changes have been saved.")
          }
        },
        error => console.log(error)
      );
}

themechange(color){
  console.log(color);
  if(color=="Default"){
    this.bgimage="";
    document.querySelector('#bgimage')?document.querySelector('#bgimage').removeAttribute("style"):'';
    document.querySelector('#bgimage')?document.querySelector('#bgimage').setAttribute("style","background-color:white !important;"):'';
    document.querySelector('#bannerbg')?document.querySelector('#bannerbg').removeAttribute("style"):'';
    var str="background:url('"+this.bannerimage+"') center center / cover no-repeat; height: 100%;";
    document.querySelector('#bannerbg')?document.querySelector('#bannerbg').setAttribute("style",str):'';
    this.mainheadlinefont="'Bai Jamjuree', sans-serif";
    this.subheadlinefont="'Bai Jamjuree', sans-serif";
    this.textcolor=this.textcolorbup;
    this.primarycolor="#53565A";
    this.buttoncolor="#ff3823";
    this.transparentbg=this.transparentbgbup;
  }
  else {
     
    if(color=="Black Dots"){
      this.bgimage="../../assets/blackdots.png"     
      this.mainheadlinefont="'Bai Jamjuree', sans-serif";
      this.subheadlinefont="'Bai Jamjuree', sans-serif";
      this.textcolor="#ffffff"
      this.primarycolor="#ffffff";
      this.buttoncolor="#ff3823"; 
      this.transparentbg=false;
    } 
    if(color=="Colorfest"){
      this.bgimage="../../assets/colorfest.png"      
      this.mainheadlinefont="'Aldrich', sans-serif";
      this.subheadlinefont="'Open Sans', sans-serif";
      this.textcolor="#a4343a"
      this.primarycolor="#ffffff";
      this.buttoncolor="#a4343a"; 
      this.transparentbg=true;
    } 
    if(color=="Confetti"){
      this.bgimage="../../assets/confetti.png"      
      this.mainheadlinefont="'Aldrich', sans-serif";
      this.subheadlinefont="'Open Sans', sans-serif";
      this.textcolor="#000000"
      this.primarycolor="#000000";
      this.buttoncolor="#d60e16"; 
      this.transparentbg=true;
    } 
    if(color=="Gifts"){
      this.bgimage="../../assets/gifts.png"      
      this.mainheadlinefont="'Open Sans', sans-serif";
      this.subheadlinefont="'Open Sans', sans-serif";
      this.textcolor="#c5292c"
      this.primarycolor="#000000";
      this.buttoncolor="#000000"; 
      this.transparentbg=true;
    } 
    if(color=="Scribbles"){
      this.bgimage="../../assets/scribbles.png"  
      this.mainheadlinefont="'Bad Script', cursive";
      this.subheadlinefont="'Bai Jamjuree', sans-serif";
      this.textcolor="#c5292c"
      this.primarycolor="#ffffff";
      this.buttoncolor="#c5292c";   
      this.transparentbg=true; 
    } 
    if(color=="Snowflakes"){
      this.bgimage="../../assets/snowflakes.png"    
      this.mainheadlinefont="'Antic Slab', serif";
      this.subheadlinefont="'Antic Slab', serif";
      this.textcolor="#ffffff"
      this.primarycolor="#fa0102";
      this.buttoncolor="#fa0102";   
      this.transparentbg=false;
    } 
    if(color=="Wellness"){
      this.bgimage="../../assets/wellness.png"    
      this.mainheadlinefont="'Bad Script', cursive";
      this.subheadlinefont="'Bad Script', cursive";
      this.textcolor="#53565a"
      this.primarycolor="#ffffff";
      this.buttoncolor="#53565a";   
      this.transparentbg=true;
    } 
    
    document.querySelector('#bannerbg')?document.querySelector('#bannerbg').removeAttribute("style"):'';
      var str="background:url('"+this.bgimage+"')";
      document.querySelector('#bannerbg')?document.querySelector('#bannerbg').setAttribute("style",str):'';
  }
}

}


