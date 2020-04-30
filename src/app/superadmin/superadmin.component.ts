import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../app/api.service";
import { FormBuilder, FormGroup,FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { DataService } from "../data.service";
import {ExcelService} from './excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-superadmin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.scss']
})
export class SuperadminComponent implements OnInit {

  lgn;
  sidebar=true;
  menuItems: any[];
  stores;
  orders;
  title="Dashboard";
  section="dashboard";
  storesettings;
  dynamicForm: FormGroup;
  cname
  launchdate=new Date();
  enddate=new Date();
  deliverdate=new Date();
  domaindata=[];
  domainerror=false;
  promolength;
  productdetail;
  baseurl= window.location.hostname.includes("localhost")?"http://localhost":"";
  customimages=[];
  customer_confirmed=false;
  pending=false;
  all_denied=false;
  currentstoreid;
  currentstorename;

  allcats;
  diffDays=0;
  myData: any;
  colorArray: ColorGroup[] = [];
  selection = [];
  seeselection= Array();
  uniqueprods=Array();
  modalReference: any;
  productdata;
  products;
  pb;
  pcheck=false;
  addressesarray;
  addsetting;
  paddress;
  ss;
  Address = Array();
  addresserrors = false;
  addAnother = false;
  showpaddress=false;


  constructor(private formBuilder: FormBuilder,private modalService: NgbModal,private excelService:ExcelService,private route: ActivatedRoute,private apiService: ApiService,private router: Router, private data: DataService) {
  this.data.currentAdmin.subscribe(message => this.lgn=message);
    if(sessionStorage.getItem("adminlgn")=="true"){ 
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
      return;
    }
    else{
      this.router.navigate(['/superadmin/login']);
    }
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.apiService.getStores().subscribe(
      user => {
        this.stores = user["stores"];
        console.log(this.stores);
      },
      error => console.log(error)
    ); 
  }

  logout(){
    this.data.changeAdmin(false);
    sessionStorage.removeItem("adminlgn");
    var url="/superadmin/login";
    this.router.navigate([url]);  
  }

  exportexcel(data):void {
    this.excelService.exportAsExcelFile(data, 'sample');
 }

  openStore(site){
    var url="stores/"+site+"/home";
    window.open(url, '_blank');
    // this.router.navigate([url]);
  }
  
  getstoreorders(storeid,storename){
    this.apiService.getstoreorders(storeid).subscribe(
      user => {
        if(!user["error"]){
          this.orders = user["orders"];
          console.log(this.orders);
          this.exportexcel(this.orders);
          this.customer_confirmed=this.orders[0].customer_confirmed==1?true:false;   
          this.pending=this.orders.some(function(o){return o['Pending'] == '1'});     
          this.all_denied=!this.orders.some(function(o){return o['deny'] == '0'});
          this.section="orders_store";
          this.title=storename+" Orders";
        }
        else{
          alert("No Orders Placed Yet");
        }
        
      },
      error => console.log(error)
    ); 
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
        }     
      },
      error => console.log(error)
    );
  }

  storeproductdetails(storeid,storename){
    this.apiService.storeproductdetails(storeid).subscribe(
      user => {
        this.productdetail = user.products;
        console.log(this.productdetail)
        this.section="product_detail";
        this.title=storename+" Update Product Images";
      },
      error => console.log(error)
    ); 
  }

  isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
  }

  public fileChangeEvent(fileInput: any,storeid,productid,attrid,i){
    if (fileInput.target.files && fileInput.target.files[0]) { 
      if(this.isFileImage(fileInput.target.files[0])){
      const formData = new FormData();      
      formData.append('logo', fileInput.target.files[0]);           
      formData.append('filename',storeid+'-'+productid+'-'+attrid);
      formData.append('storeid', storeid);
      this.apiService.uploadproductimage(formData).subscribe(
        (res) => {
          // this.uploadResponse = res;
            console.log(res);
            console.log(this.baseurl+"/php_api/"+res.url);  
            this.customimages[i]=this.baseurl+"/php_api/"+res.url;
            console.log(i,this.customimages[i])
        },
        (err) => {  
          console.log(err);
        }
      );
    } 
    else{
      alert("Only Images please");
    }
  }
}

updateimage(storeid,productid,attrid,i){
  console.log(i,this.customimages[i]);
  if(this.customimages[i]){
    const formData = new FormData();   
    formData.append('storeid',storeid);  
    formData.append('productid',productid); 
    formData.append('attrid',attrid); 
    formData.append('imageurl',this.customimages[i]); 
    this.apiService.updateproductimage(formData).subscribe(
      (res) => {       
          console.log(res);     
          if(!res["error"]){
            this.productdetail[i].custom_image=1;
            this.productdetail[i].custom_image_url=this.customimages[i];   
            alert ("Image updated successfully.")
            this.storeproductdetails(storeid,this.currentstorename)
          }            
          else{
            alert ("Error uploading image try again.")
          }
      },
      (err) => {  
        console.log(err);
      });  
  }
  else{
    alert ("Error uploading image try again.")
  }
}




  getstoresettings(storeid,storename){
    this.apiService.all_cats().subscribe(
      user => {
        console.log(user["cats"]);
        this.allcats=(user["cats"]);
      },
      error => console.log(error)
    );
    this.currentstoreid=storeid;
    this.currentstorename=storename;
    this.apiService.getStoreSettings(storeid).subscribe(
      user => {
      console.log(user,"datas")
       this.storesettings=user;       
       this.storesettings= this.storesettings.filter(val => !(["nobanner","buttoncolor","primarycolor","transparentbg","textcolor","theme","logoimage","bannerimage","bannerheading","bannerdesc","reason","giftlogo"].includes(val.control)));       
       this.loadupFormGroup();
       this.section="store_storesettings";
       this.title=storename+" Store Settings";
      },
      error => console.log(error)
    );
  }

  addressmgmt(){
    
    this.addressesarray= new FormArray([]);
    this.apiService.shipsettings(this.currentstoreid).subscribe(
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

  saveaddress(){
    if(this.pcheck){
      alert("Please confirm Shipping Setting");
      return;
    }
    var storedata=({shipping:this.addsetting})
    var finaldata=({ storedata: storedata,addressdata:this.addressesarray.value,storeid:this.currentstoreid});
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

  update2caddress(suid){
    const ele = document.getElementById(suid) as HTMLInputElement;
    
    console.log(this.currentstoreid,suid,ele.value);
    var adaarray=[ele.value];
    var finaldata=({storeid:this.currentstoreid ,addressids:adaarray,storeuserid: suid});
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
    });
   }

   selectChange(control){
    if(control=="promolength"){
      this.promolength=0;
      switch(this.dynamicForm.controls[control].value.replace(/[^0-9]/g,'')){
        case "1": this.promolength=30;break;
        case "3": this.promolength=90;break;
        case "6": this.promolength=180;break;
        case "12": this.promolength=365;break;
      }
        let today = new Date();
        
      this.launchdate= this.addDays(today, 1);
      this.enddate= this.addDays(this.launchdate, this.promolength);
      this.deliverdate= this.addDays(this.enddate, 21);
      
      // (<HTMLInputElement>document.getElementById("launchdate")).value=this.launchdate.toISOString().substr(0, 10);
      (<HTMLInputElement>document.getElementById("launchdate")).min=this.launchdate.toISOString().substr(0, 10);
      // (<HTMLInputElement>document.getElementById("enddate")).value=this.enddate.toISOString().substr(0, 10);
      (<HTMLInputElement>document.getElementById("enddate")).min=this.enddate.toISOString().substr(0, 10);
      // (<HTMLInputElement>document.getElementById("deliverdate")).value=this.deliverdate.toISOString().substr(0, 10);
      (<HTMLInputElement>document.getElementById("deliverdate")).min=this.deliverdate.toISOString().substr(0, 10);
      
      this.dynamicForm.controls.launchdate.patchValue(this.launchdate.toISOString().substr(0, 10), {onlySelf: true});
      this.dynamicForm.controls.enddate.patchValue(this.enddate.toISOString().substr(0, 10), {onlySelf: true});
      this.dynamicForm.controls.deliverdate.patchValue(this.deliverdate.toISOString().substr(0, 10), {onlySelf: true});
      // console.log(this.dynamicForm.controls[control].value.replace(/[^0-9]/g,''));
    }
  }
  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  addDomain(){

  }

  removeDomain(x){}

  onFileSelect(x,y){}
  submit(){}

  
  dateChange(control){
    if(control=="launchdate"){
      // if(this.dynamicForm.controls.launchdate.value<this.launchdate.toISOString().substr(0, 10)){
      //   alert("Error");
      // }
     var launchdate=this.dynamicForm.controls.launchdate.value;
      this.enddate= this.addDays(launchdate, this.promolength);
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
    this.apiService.getstoreproducts(this.currentstoreid).subscribe(
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
  }
  //remove color to color array
  removefromcart(pname, pid, attr2) {
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

  saveproductselection(){
    var finaldata=({storeid:this.currentstoreid ,productdata: this.productdata});
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


}

export interface ColorGroup {
  productid?: number;
  colorattr?: any;
  checked?: boolean;
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
    path: "stores",
    title: "Show All Stores",
    icon: "fa fa-home",
    bgclass:"warning",
  },
  // {
  //   path: "orders",
  //   title: "Show All Orders",
  //   icon: "fa fa-shopping-cart",
  //   bgclass:"primary",
  // },
  {
    path: "payments",
    title: "Store Payments",
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
