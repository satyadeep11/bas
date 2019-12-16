import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../app/api.service";
import { FormBuilder, FormGroup,FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { DataService } from "../../data.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
sidebar=true;
title="Dashboard";
section="dashboard";
menuItems: any[];
storeid;
users:any;
orders:any;
storename;
storesettings;
dynamicForm: FormGroup;
cname
launchdate=new Date();
enddate=new Date();
deliverdate=new Date();
domaindata=[];
domainerror=false;
promolength;
logoimage;
bannerimage;
site;
pending=false;
end=false;
total=0;
diffDays=0;
customer_confirmed=false;
all_denied=false;
myData: any;
home;
  seeselection= Array();
  uniqueprods=Array();
  selection = [];
  modalReference: any;
  products:any;
  pb;
  colorArray: ColorGroup[] = [];
  productdata:any;
  allcats;
  addressesarray;
  Address = Array();
  addresserrors = false;
  addAnother = false;
  addsetting;
  paddress;
  ss;
  pcheck=false;
  showpaddress=false;
  emplist= Array();;
  

  constructor(private formBuilder: FormBuilder,private modalService: NgbModal,private route: ActivatedRoute,private apiService: ApiService,private router: Router, private data: DataService) {
    
    if(sessionStorage.getItem("mgrlgn")===null||sessionStorage.getItem("mgrlgn")=="false"){
      this.route.params.subscribe(params => {
        this.site=params['id'];   
      var url="/stores/"+this.site+"/admin/login";
        this.router.navigate([url]);  
      });
    }
    else{
      this.route.params.subscribe(params => {
        this.site=params['id'];   
        if(sessionStorage.getItem("mgrlgn")===null||sessionStorage.getItem("mgrlgn")=="false"){
          console.log("asda")
          var logcheck;
          this.data.currentManager.subscribe(message => logcheck=message);   
          if(!logcheck){
            var url="/stores/"+this.site+"/admin/login";
            this.router.navigate([url]);          
          }
        } 
  
        this.home="/stores/"+this.site+"/home";
        if(!sessionStorage.getItem("mgrlgn")){
          var url="/stores/"+this.site+"/admin/login";
            this.router.navigate([url]);  
            console.log("here0")
        }
  
        
      });
  
      this.apiService.checkSite(this.site).subscribe(
        user => {
          console.log(user);
         this.storeid=user.sitedata[0].StoreID; 
         this.customer_confirmed=user.sitedata[0].customer_confirmed==1?true:false;
         this.apiService.getstoreusers(this.storeid).subscribe(
          user => {
            this.users = user["users"];
          },
          error => console.log(error)
        );
        this.apiService.getstoreorders(this.storeid).subscribe(
          user => {
            if(!user.error){
            this.orders = user["orders"];
            this.pending=this.orders.some(function(o){return o['Pending'] == '1'});
            this.all_denied=!this.orders.some(function(o){return o['deny'] == '0'});
            
            //
            var uniqpids= [...new Set(this.orders.map(item => item.Productid))];
            console.log(uniqpids)
            uniqpids.forEach((pid)=> {
              var count=0;
              this.orders.forEach((v) => (v['Productid'] == pid && count++));
              var data=({ productid: pid , qty: count});
              this.apiService.getsinglepricingbreak(data).subscribe(
                user => {
                  console.log(pid,user.pricingbreaks[0].Price,"price");
                  this.orders.forEach((item)=> {
                    if (item.Productid==pid) {
                      item.price = user.pricingbreaks[0].Price;  
                      if(item.deny!=1){
                        this.total=this.total+parseInt(item.price);   
                      }
                                       
                  }
                  });
                },
                error => console.log(error)
              );
            });  
            //
            this.orders.forEach((item)=> {  
              if (item.Shipping) {
                if(item.deny!=1){
                  this.total =this.total+10; 
                }                                 
            }
            });
            console.log(user,this.orders,this.total,"ho")
          }
          },
          error => console.log(error)
        );
         this.storename=user.sitedata[0].StoreName;        
         this.apiService.getStoreSettings(this.storeid).subscribe(
          user => {
            console.log(user,"datas")
           this.storesettings=user;
           console.log(this.storesettings)
           this.storesettings= this.storesettings.filter(val => !(["theme","logoimage","bannerimage","bannerheading","bannerdesc","reason","giftlogo"].includes(val.control)));
           console.log(this.storesettings)           
           this.loadupFormGroup();
          },
          error => console.log(error)
        );

        this.apiService.all_cats().subscribe(
          user => {
            console.log(user["cats"]);
            this.allcats=(user["cats"]);
          },
          error => console.log(error)
        );
  
        }
         ); 
         this.cname=JSON.parse(sessionStorage.getItem("ud"))["Firstname"]+' '+JSON.parse(sessionStorage.getItem("ud"))["Lastname"];
    }    
   }

   loadupFormGroup(){
    let group = {};
    this.storesettings.forEach(input_template => {
      if(input_template.validator){
        input_template.validators=[];
        if(input_template.validator.includes("required")){          
          input_template.validators.push(Validators.required);
        }
        if(input_template.validator.includes("email")){          
          input_template.validators.push(Validators.email);
        }
      }
      group[input_template.control] = new FormControl(
        "",
        input_template.validators
      );
      if(input_template.control=="domainname"){
        if(input_template.value.length>1)
        this.domaindata=input_template.value.split(",");
      }
    });
    this.dynamicForm = new FormGroup(group);       
    this.storesettings.forEach(input_template => {
      if(input_template.type!='file'){
        this.dynamicForm.controls[input_template.control].patchValue(input_template.value);  
      }
        
      if(input_template.control=="domainname"){
        this.dynamicForm.controls.domainname.patchValue("");
      }  
      if(input_template.control=="storeurl"){
        this.dynamicForm.controls.storeurl.disable();
      }  
      if(input_template.control=="email"){
        this.dynamicForm.controls.email.disable();
      } 
      if(input_template.control=="enddate"){
        this.enddate=new Date(input_template.value);   
        var endday=new Date(input_template.value);   
        const today = new Date()
        if(endday>today){
          this.end=false;
        }else{
          this.end=true;
        } 
      } 
      if(input_template.control=="deliverdate"){
        this.deliverdate=new Date(input_template.value);   
      } 
    });
   }

 getprice(pid,i){
   var count=0;
   this.orders.forEach((v) => (v['Productid'] == pid && count++));
  //  var data=({ productid: pid , qty: count});
  //  this.apiService.getsinglepricingbreak(data).subscribe(
  //   user => {
  //     console.log(user,"price")
  //   },
  //   error => console.log(error)
  // );
  console.log("price")
   return count;
 }



   submit(){
    // if(this.logoimage){
    //   const formData = new FormData();
    //       formData.append('logo', this.logoimage);
    //       formData.append('url', this.dynamicForm.controls.storeurl.value);
    //       formData.append('field', 'logoimage');
    //       this.apiService.uploadFile(formData).subscribe(
    //         (res) => {
    //           // this.uploadResponse = res;
    //             console.log(res);
    //         },
    //         (err) => {  
    //           console.log(err);
    //         }
    //       );
    //   }
    //   if(this.bannerimage){
    //   const formData = new FormData();
    //       formData.append('logo', this.bannerimage);
    //       formData.append('url', this.dynamicForm.controls.storeurl.value);
    //       formData.append('field', 'bannerimage');
    //       this.apiService.uploadFile(formData).subscribe(
    //         (res) => {
    //           // this.uploadResponse = res;
    //             console.log(res);
    //         },
    //         (err) => {  
    //           console.log(err);
    //         }
    //       );
    //     }

    if (this.dynamicForm.invalid) {
      window.scroll(0,0);
      return;
  }

    if(this.dynamicForm.controls.loginoption.value.includes('email')){
      if(this.domaindata.length==0){
        alert("please enter atleast one domain");
        window.scroll(0,0);
        return;
      }
    }

    this.dynamicForm.controls.domainname.patchValue(this.domaindata.join());
    console.log(this.dynamicForm.value);
    var finaldata=({ storedata: this.dynamicForm.value , storeid:this.storeid});
    this.dynamicForm.controls.domainname.patchValue("");
    
    this.apiService.update_store_setting(finaldata).subscribe(
      user => {
        console.log(user,"here"); 
        alert("Settings updated");        
      },
      error => {
        console.log(error);       
      },
    );
   }

   onFileSelect(event,name){
    if (event.target.files.length > 0) {
      if(name=="logoimage"){
        this.logoimage = event.target.files[0];
      }
      else if(name=="bannerimage"){
        this.bannerimage = event.target.files[0];
      }
    }
  }


   addDomain(){
    const domainPattern = "^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$";           
    this.dynamicForm.controls.domainname.setValidators([Validators.required,Validators.pattern(domainPattern)]);
    this.dynamicForm.controls.domainname.updateValueAndValidity();
    
    if (this.dynamicForm.controls.domainname.invalid) {
      this.domainerror =  true ;
    }  else{
      this.domainerror =  false ;
      this.domaindata.push(this.dynamicForm.controls.domainname.value);
      this.dynamicForm.controls.domainname.patchValue('');
      this.dynamicForm.controls.domainname.clearValidators();
      this.dynamicForm.controls.domainname.updateValueAndValidity();
    }
    
}
removeDomain(itemx){  
  this.domaindata=this.domaindata.filter(item => item !== itemx)
  console.log(itemx,this.domaindata)
}

selectChange(control){
  // if(control=="promolength"){
  //   this.promolength=0;
  //   switch(this.dynamicForm.controls[control].value.replace(/[^0-9]/g,'')){
  //     case "1": this.promolength=30;break;
  //     case "3": this.promolength=90;break;
  //     case "6": this.promolength=180;break;
  //     case "12": this.promolength=365;break;
  //   }
  //     let today = new Date();
      
  //   this.launchdate= this.addDays(today, 1);
  //   this.enddate= this.addDays(this.launchdate, this.promolength);
  //   this.deliverdate= this.addDays(this.enddate, 21);
    
  //   // (<HTMLInputElement>document.getElementById("launchdate")).value=this.launchdate.toISOString().substr(0, 10);
  //   (<HTMLInputElement>document.getElementById("launchdate")).min=this.launchdate.toISOString().substr(0, 10);
  //   // (<HTMLInputElement>document.getElementById("enddate")).value=this.enddate.toISOString().substr(0, 10);
  //   (<HTMLInputElement>document.getElementById("enddate")).min=this.enddate.toISOString().substr(0, 10);
  //   // (<HTMLInputElement>document.getElementById("deliverdate")).value=this.deliverdate.toISOString().substr(0, 10);
  //   (<HTMLInputElement>document.getElementById("deliverdate")).min=this.deliverdate.toISOString().substr(0, 10);
    
  //   this.dynamicForm.controls.launchdate.patchValue(this.launchdate.toISOString().substr(0, 10), {onlySelf: true});
  //   this.dynamicForm.controls.enddate.patchValue(this.enddate.toISOString().substr(0, 10), {onlySelf: true});
  //   this.dynamicForm.controls.deliverdate.patchValue(this.deliverdate.toISOString().substr(0, 10), {onlySelf: true});
  //   // console.log(this.dynamicForm.controls[control].value.replace(/[^0-9]/g,''));
  // }
}

addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

approvesingleorder(psid,i){
  var data=({ psid: psid });
  this.apiService.approveselection(data).subscribe(
    user => {
      console.log(user); 
      if(!user["error"]){
        this.orders[i].Pending=0;
        this.orders[i].deny=0;
        this.pending=this.orders.some(function(o){return o['Pending'] == '1'});
        this.all_denied=!this.orders.some(function(o){return o['deny'] == '0'});
        console.log(this.all_denied)
      }     
    },
    error => console.log(error)
  );
}


denysingleorder(psid,i){
  var data=({ psid: psid });
  this.apiService.denyselection(data).subscribe(
    user => {
      console.log(user); 
      if(!user["error"]){
        this.orders[i].Pending=0;
        this.orders[i].deny=1;
        this.pending=this.orders.some(function(o){return o['Pending'] == '1'});
        this.all_denied=!this.orders.some(function(o){return o['deny'] == '0'});
        console.log(this.all_denied)
      }     
    },
    error => console.log(error)
  );
}

approveallorders(){
  var data=({ storeid: this.storeid });
  this.apiService.approveallselection(data).subscribe(
    user => {
      console.log(user); 
      if(!user["error"]){
        this.orders.forEach((item)=> {
          item.Pending=0;
          this.pending=this.orders.some(function(o){return o['Pending'] == '1'});
          this.all_denied=!this.orders.some(function(o){return o['deny'] == '0'});
        });
      }     
    },
    error => console.log(error)
  );
}

confirmorders(){
  if(this.orders.some(function(o){return o['Pending'] == '1'})){
    alert("Stop Cheating");
  }
  else{
    var data=({ storeid: this.storeid });
    this.apiService.confirmorders(data).subscribe(
      user => {
        console.log(user); 
        if(!user["error"]){
          this.customer_confirmed=!this.customer_confirmed;
        }     
      },
      error => console.log(error)
    );
  }
  }

dateChange(control){
  if(control=="launchdate"){
    // if(this.dynamicForm.controls.launchdate.value<this.launchdate.toISOString().substr(0, 10)){
    //   alert("Error");
    // }
   var launchdate=this.dynamicForm.controls.launchdate.value;
    // this.enddate= this.addDays(launchdate, this.promolength);
    this.deliverdate= this.addDays(this.enddate, 21);
    this.dynamicForm.controls.enddate.patchValue(this.enddate.toISOString().substr(0, 10), {onlySelf: true});
    this.dynamicForm.controls.deliverdate.patchValue(this.deliverdate.toISOString().substr(0, 10), {onlySelf: true});    
    (<HTMLInputElement>document.getElementById("enddate")).min=this.enddate.toISOString().substr(0, 10);
    (<HTMLInputElement>document.getElementById("deliverdate")).min=this.deliverdate.toISOString().substr(0, 10);
  }

  if(control=="enddate"){      
    var enddate= this.dynamicForm.controls.enddate.value;
    this.deliverdate= this.addDays(enddate, 21);     
    this.dynamicForm.controls.deliverdate.patchValue(this.deliverdate.toISOString().substr(0, 10), {onlySelf: true});
    (<HTMLInputElement>document.getElementById("deliverdate")).min=this.deliverdate.toISOString().substr(0, 10);
  }
  
  if(control=="loginoption"){
    if(this.dynamicForm.controls.loginoption.value.includes("Domain")){

    }
    else{
      
    }
  }
}

  ngOnInit() {
    if(window.innerWidth <= 992){
      this.sidebar=false;
    }
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.data.changeMessage(true);
  }

  logout(){
    this.data.changeMessage(false);
    sessionStorage.removeItem("mgrlgn");
    var url="/stores/"+this.site+"/admin/login";
    this.router.navigate([url]);  
  }

  suspendFunction(a,b){
  }
  deleteCustomer(a){}
  editCustomerInfo(a,b,c,d,e,f){}

  seeSelections(content){
    this.seeselection=[];
    var copyData=this.myData;
    copyData.forEach(element => {
      if (Array.isArray(element.ImageFile)){        
        element.Attr2.forEach((a2id, i) => {          
          if(this.selection.some(function(o) {return o["colorattr"] == a2id;})){           
            var copyelement=JSON.parse(JSON.stringify(element));                      
            copyelement.ImageFile=element.ImageFile[i];
            copyelement.Attr2=element.Attr2[i];
            copyelement.A2_Label=element.A2_Label[i];//
            copyelement.Color=element.Color[i];//
            this.seeselection.push(copyelement);//            
          }
        });
      }
      else{
        if(this.selection.some(function(o) {return o["colorattr"] == element.Attr2;})){          
          this.seeselection.push(element);
        }
      }      
    });
    this.modalReference=this.modalService.open(content, { centered: true });
    console.log(this.selection);
    this.productdata=this.selection;
    console.log("here",this.seeselection);
    this.apiService.changeMessage(this.seeselection);
    localStorage.setItem("selections", JSON.stringify(this.seeselection));
  }

  addtocart(pname, pid, attr2, a2_label,imagefile) {

    if(this.emplist.length==0){
      
    }
    else{
      this.emplist.forEach(element=>{
        if(element[0].attrid==parseInt(attr2) && element[0].productid==parseInt(pid)){     
          this.emplist.splice(this.emplist.findIndex(p => p.attrid == parseInt(attr2)),1);               
        }
      }); 
    }  
    console.log(this.emplist);


    var i = 0;
    if (Array.isArray(attr2)) {
      attr2.forEach((a2id,i) => {
        this.colorArray.forEach((element) => {
          if (element.colorattr == a2id) {
            if (element.checked) {
              if (
                !this.selection.some(function(o) {
                  return o["colorattr"] == a2id;
                })
              ) {
                this.selection.push({ productid: pid, colorattr: a2id,productname:pname,image:imagefile[i] });
                this.seeselection.push({ productid: pid, colorattr: a2id });
                // this.openSnackBar("Product " + pname + " of color "+ a2_label[i] +" added to Selection","","green-snackbar");
                i++;
              } else {
                i++;
                // this.openSnackBar("Product " + pname + " of color "+ a2_label[i] + "already added","","blue-snackbar");
              }
            }
            if (i == 0) {
              // this.openSnackBar("No Color Selected", "", "red-snackbar");
            }
          }
        });        
      });
    } else {
      if (
        !this.selection.some(function(o) {
          return o["colorattr"] == attr2;
        })
      ) {
        this.selection.push({ productid: pid, colorattr: attr2 ,productname:pname,image:imagefile});
        this.seeselection.push({ productid: pid, colorattr: attr2 });
        // this.openSnackBar("Product " + pname + " of color "+ a2_label + " added to Selection","","green-snackbar");
      } else {
        // this.openSnackBar("Product " + pname + " of color "+ a2_label + " already added","","blue-snackbar");
      }
    }
    console.log(this.selection);
    this.title='Product Management ('+ this.selection.length+ ' Selections)'
  }
  //remove color to color array
removefromcart(pname, pid, attr2) {
  var count=0;
  var finaldata=({productid:pid,storeid:this.storeid ,attrid:attr2});
  this.apiService.check_store_product_order(finaldata).subscribe(
    user => {        
      console.log(user);
      if(!user.error){     
        
        if(user.emplist){
          count=user.emplist.length;
          if (confirm('Removing this item will cancel '+ count + ' order(s). Continue?')) {
            if(this.emplist.length==0){
              this.emplist.push(user.emplist);
            }
            else{
              this.emplist.forEach(element=>{
                if(element[0].attrid==parseInt(attr2) && element[0].productid==parseInt(pid)){                    
                }
                else{              
                  this.emplist.push(user.emplist);
                }
              }); 
            }  
            console.log(this.emplist);
          } else {
            return;
          }
        }
        

   var i=0;
    if (Array.isArray(attr2)) {
      attr2.forEach(a2id => {
        this.colorArray.forEach(element => {
          if (element.colorattr == a2id) {
            if (element.checked) {
              if (
                this.selection.some(function(o) {
                  return o["colorattr"] == a2id;
                })
              ) {
                this.selection.splice(this.selection.findIndex(p => p.colorattr == a2id),1);
                this.seeselection.splice(this.seeselection.findIndex(p => p.Attr2 == a2id),1);
              }
              element.checked = !element.checked;
              i++;
            }
            if (i == 0) {
              
            }
          }
        });
      });
    } else {
      if (
        this.selection.some(function(o) {
          return o["colorattr"] == attr2;
        })
      ) {
        this.selection.splice(this.selection.findIndex(p => p.colorattr == attr2),1);
        this.seeselection.splice(this.seeselection.findIndex(p => p.Attr2 == attr2),1);
        // this.openSnackBar(
        //   "Product " + pname + " removed from Selection",
        //   "",
        //   "red-snackbar"
        // );
      }
    }
    // if(this.seeselection.length==0 && this.modalService.hasOpenModals()){
    //   this.closeModal();
    // }
    console.log(this.seeselection);
    this.title='Product Management ('+ this.selection.length+ ' Selections)'


      
      }
    },
    error => console.log(error)
  );


    
  }

  closeModal(){
    this.modalReference.close();
  }

  pricingbreaks(pid,a2){
    var data=({ productid: pid , attr2: a2});
    this.apiService.getpricingbreaks(data).subscribe(
      user => {
        this.pb = user["pricingbreaks"];
      },
      error => console.log(error)
    );
  }

  productdetails(modal,product){
    this.products=this.myData.filter(item => item.ProductID == product.ProductID);     
    this.productdata=this.selection.filter(item => item.productid == product.ProductID);
    console.log(this.products,this.productdata,this.selection)    
    this.modalReference=this.modalService.open(modal, { centered: true,size:"lg" });    
    if(this.isArray(this.products[0].Attr2)){
      this.pricingbreaks(this.products[0].ProductID,this.products[0].Attr2[0]);
    }
    else{
      this.pricingbreaks(this.products[0].ProductID,this.products[0].Attr2);
    }    
  }

  isArray(obj: any) {
    return Array.isArray(obj);
  }

  removeCheck(attr2) {
    if (Array.isArray(attr2)) {
      var x =0;
      attr2.forEach(a2id => {
        if (
          this.selection.some(function(o) {
            return o["colorattr"] == a2id;
          })
        ) {
          x ++;
        }
      });
      return x;
    } else {
      return this.selection.some(function(o) {
        return o["colorattr"] == attr2;
      });
    }
  }

  productmgmt(){
    var ed = new Date(this.dynamicForm.controls.enddate.value);
    var dd = new Date(this.dynamicForm.controls.deliverdate.value);
    const diffTime = Math.abs(dd.getTime() - ed.getTime());
    this.diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))||0; 
    console.log(this.diffDays)
    this.apiService.all_products().subscribe(
      user => {
        this.myData = Object.keys(user).map(e => user[e]);
        this.myData = this.mergeandflat(this.myData);
        this.colorArray=[];
        this.createColorArray( this.myData);
        console.log(this.myData); 
        this.getstoredata();
      },
      error => console.log(error)
    );    
  }


  //address functions
//add single address
addSingleAd(i) {
  // console.log(this.dynamicForm.controls);
  this.addresserrors = true;
  if (this.addressesarray.invalid) {
    return;
  }    
  this.Address[i] = false;  
  this.addAnother = true;    
  this.addresserrors = false;
}
//remove single address
CancelSingleAd(i) {
  this.addressesarray.removeAt(i);
  this.addAnother = true;
}
//edit address
EditSingleAd(i) {
  this.Address[i] = true;
  for (var x = 0; x <= this.addressesarray.length; x++) {
    if (this.Address[x] && x != i) {
      this.CancelSingleAd(x);
    }
  }
}
//add annother addrress
addAnotherAd() {
  this.addresserrors = true;
  {
    this.Address[this.addressesarray.length] = true;
    this.addressesarray.push(
      this.formBuilder.group({
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
      })
    );
    this.addresserrors = false;
    this.addAnother = false;
  }
}

update2caddress(suid){
  const ele = document.getElementById(suid) as HTMLInputElement;
  
  console.log(this.storeid,suid,ele.value);
  var adaarray=[ele.value];
  var finaldata=({storeid:this.storeid ,addressids:adaarray,storeuserid: suid});
  this.apiService.update_caddress(finaldata).subscribe(
    user => {        
      console.log(user);
      if(!user.error){
        this.saveaddress();
      }
    },
    error => console.log(error)
  );

}

  addressmgmt(){
    
    this.addressesarray= new FormArray([]);
    this.apiService.shipsettings(this.storeid).subscribe(
      user => {        
        console.log(user); 
        this.ss=user;        
        this.addsetting=user.shipping.empshipsetting;
        this.paddress=user.shipping.personal;
        if (user.shipping.addressess.length > 0) {          
          user.shipping.addressess.forEach(
            (element, i) => {
              this.addressesarray.push(
                this.formBuilder.group({
                  addressname: [element.addressname, Validators.required],
                  streetaddress: [element.streetaddress, [Validators.required]],
                  streetaddress2: [element.streetaddress2],
                  city: [element.city, [Validators.required]],
                  state: [element.state, [Validators.required]],
                  zip: [element.zip,[ Validators.required,  Validators.pattern("^[0-9]{5}(?:-[0-9]{4})?$")]]
                })
              );
              this.Address[i] = false;
            }
          );
          this.addAnother = true;
        }
        this.addsetting=='To a corporate address'?this.showpaddress=true:this.showpaddress=false;
      },
      error => console.log(error)
    ); 

    console.log(this.addressesarray)
   

  }

  personalcheck(){
    if(this.addsetting=="To a corporate address"){
      if(this.paddress.length>0){
        this.pcheck=true;           
      }else{
        this.pcheck=false;
        this.showpaddress=false; 
      }
    }
    else{
      this.pcheck=false;
      this.showpaddress=false;
    }
  }

  createColorArray(myData){
    myData.forEach(element => {
      if (Array.isArray(element.ImageFile)) {      
        element.Attr2.forEach((element1, i) => {
          if (i == 0)
            this.colorArray.push({productid: element.ProductID,colorattr: element1,checked: true});
          else
            this.colorArray.push({productid: element.ProductID,colorattr: element1,checked: false});
        });
        
      } 
      else {
        this.colorArray.push({productid: element.ProductID,colorattr: element.Attr2,checked: true});
      }
      // this.addedcart.push({ productid: element.ProductID, added: false });
    });
  }

  getstoredata(){
    this.apiService.getstoreproducts(this.storeid).subscribe(
      user => {
        if(user.products){
        this.selection=user.products;
        console.log(this.selection.length,"fromdb"); 
        this.title='Product Management ('+ this.selection.length+ ' Selections)'
        this.createproductlist();
      }
      },
      error => console.log(error)
    );    
  }

  createproductlist(){
    this.seeselection=[];
    var copyData=this.myData;
    copyData.forEach(element => {
      if (Array.isArray(element.ImageFile)) {        
        element.Attr2.forEach((a2id, i) => {          
          if(this.selection.some(function(o) {return o["colorattr"] == a2id;})){           
            var copyelement=JSON.parse(JSON.stringify(element));                      
            copyelement.ImageFile=element.ImageFile[i];
            copyelement.Attr2=element.Attr2[i];
            copyelement.A2_Label=element.A2_Label[i];//
            copyelement.Color=element.Color[i];//
            this.seeselection.push(copyelement);//            
          }
        });
      }
      else{
        if(this.selection.some(function(o) {return o["colorattr"] == element.Attr2;})){          
          this.seeselection.push(element);
        }
      }      
    });
    
    this.uniqueprods = this.seeselection.filter((thing, index, self) =>
    index === self.findIndex((t) => (
      t.ProductID === thing.ProductID
    ))
  )
    
    console.log("here",this.seeselection,this.uniqueprods);
    // this.apiService.changeMessage(this.seeselection);
    localStorage.setItem("selections", JSON.stringify(this.seeselection));
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
    myData.flat().forEach(x => {
      const keys = Object.keys(x);
      for (const key of keys) {
        if (x[key] != null && x[key].includes("~"))
          x[key] = x[key].split("~").map(function(item) {
            return item.trim();
          });
      }
    });
    return myData.flat();
  }

  saveproductselection(){
    if(this.emplist.length>0){
      alert("Based on the changes, "+this.emplist.length+" orders will be cancelled. They will be sent an email asking them to place an order again.");
    }
    var finaldata=({storeid:this.storeid ,productdata: this.productdata});
    this.apiService.save_product_selection(finaldata).subscribe(
      user => {        
        console.log(user,"fromdb"); 
        if(!user.error) {
          alert("Product Selection Updated");
        }   
        else{          
          console.log("error")
        }    
      },
      error => console.log(error)
    );
  }

  saveaddress(){
    if(this.pcheck){
      alert("Please confirm Shipping Setting");
      return;
    }
    var storedata=({shipping:this.addsetting})
    var finaldata=({ storedata: storedata,addressdata:this.addressesarray.value,storeid:this.storeid});
    this.apiService.update_address_setting(finaldata).subscribe(
      user => {        
        console.log(user,"fromdb"); 
        if(!user.error) {
          alert("Address Settings Updated");
          this.addressmgmt();
        }   
        else{          
          console.log("error")
        }    
      },
      error => console.log(error)
    );
  }

}

declare interface RouteInfo {
  path: string;
  title: string;
  icon:string;
  bgclass:string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "dashboard",
    title: "Dashboard",
    icon: "fa fa-dashboard",
    bgclass:"",
  },
  {
    path: "employees",
    title: "Registered Employees",
    icon: "fa fa-user",
    bgclass:"warning",
  },
  {
    path: "orders",
    title: "Orders Placed",
    icon: "fa fa-shopping-cart",
    bgclass:"primary",
  },
  {
    path: "payments",
    title: "Payment Settings",
    icon: "fa fa-money",
    bgclass:"success",    
  },
  {
    path: "storesettings",
    title: "Store Settings",
    icon: "fa fa-cog",
    bgclass:"danger",
  }
];

export interface ColorGroup {
  productid?: number;
  colorattr?: any;
  checked?: boolean;
}

