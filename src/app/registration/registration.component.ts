import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormBuilder,  FormGroup,  FormArray,  FormControl,  Validators, ValidationErrors } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { ApiService } from "../../app/api.service";
import { MatSnackBar } from "@angular/material";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute,Router } from '@angular/router';
import { DataService } from "../data.service";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  dynamicForm: FormGroup;
  submitted = false;
  section1errors = false;
  section2errors = false;
  section3errors = false;
  section4errors = false;
  addresserrors = false;
  addAnother = false;
  products;
  logoimage;
  bannerimage;
  domaindata=[];
  pb;
  dupemail=false;
  dupeurl=false;
  messagepage=false;
  progress=5;
  progressbar="progress-bar-striped";
  sectiontitle="Tell us a little about your gift store.";
  sectiondesc="Once we know the basics, you can chose your gifts and customize your store!";
  sectionbtn="Next: Choose My Gifts";
  sections;
  Address = Array();
  myData1: any;
  myData2: any;
  myData: any;
  colorArray: ColorGroup[] = [];
  selection: Selection[] = [];
  seeselection= Array();
  addedcart: Added[] = [];
  i = 0;
  x = 0;
  hide = true;
  passmismatch=false;
  password:string;
  confirmpassword:string;
  modalReference: any;
  preview=false;
  eligible=true;
  productData:any;
  urlError=false;
  alldataloaded=false;
launchdate=new Date();
enddate=new Date();
deliverdate=new Date();
promolength=0;
diffDays=0;
domainerror=false;
public url = "url(https://securedgear.com/sites/997/products/997_";
public url_close = ")";
uname="a";
pword="b";
siteurl="c";
allcats;
loading=false;
saddress;
saddressi=0;

form_template:Settings=[    
  {
    name:"Employee Count",
    type: "select",
    label:"How many people will you invite to choose a gift on your store?",
    control: "empcount",
    options: ["0-9", "10-19", "20-29", "30-39", "40+"],
    section: 1,
    validator:"required"
  },
  {
    name:"Promotion Start Date",
    type: "date",
    label: "When should the store to go live?",
    control: "launchdate", 
    validator:"required",   
    section: 1
  },
  {
    name:"Promotion End Date",
    type: "date",
    label: "When should the store stop accepting new orders?",
    control: "enddate",    
    validator:"required",
    section: 1
  },    
 {
    name:"Store Login Type",
    type: "select",
    label: "How do you want visitors to gain access to your store?",
    control: "loginoption",
    options: ["Use an access code I give them"],
    validator:"",
    section: 0   
  },
  {
    name:"Domain Name",
    type: "textBox",
    label: "Please enter a valid company domain in the field below. If you have multiple domains, continue to click Add for each one.<br>Example: giftstore.com is the domain for example@giftstore.com",
    control: "domainname",
    section: 1
  }, 
  {
    name:"Access Code",
    type: "textBox",
    label: "For security purposes, visitors will need to enter a code to gain access to your store. Please enter the code you would like to use in the field below.",
    control: "accesscode",
    validator:"required",
    section: 1
  },
  {
    name:"Shipping Options",
    type: "select",
    label: "How would you like your gifts shipped?",
    control: "shipping",
    options: ["To a corporate address", "To the recipient's home address", "Recipients can choose from a corporate address or enter their home address" ],
    validator:"required",
    section: 1    
  },
  {
    name:"Gift Delivery Date",
    type: "date",
    label:"When would you like the gifts delivered?",
    control: "deliverdate",   
    validator:"required",
    section: 1,
    
  },
  {
    name:"Gift Budget",
    type: "select",
    label: "What's your budget for each gift?",
    control: "budget",
    options: [ "$0-$4.99", "$5.00-$9.99", "$10.00-$14.99", "$15.00-$19.99", "$20.00-$24.99", "$25.00+"],
    validator:"required",
    section: 1
  },
  // {
  //   name:"Number of Gifts",
  //   type: "select",
  //   label: "How many gift options do you want to give your employees?",
  //   control: "giftcount",
  //   options: ["3", "4", "5", "6", "7"],
  //   validator:"required",
  //   section: 1
  // },
  // {
  //   name:"Promotion Length",
  //   type: "select",
  //   label: "How long will the rewards program run?",
  //   control: "promolength",
  //   options: ["1 month", "3 months", "6 months", "12 month"],
  //   validator:"required",
  //   section: 1
  // },    
  {
    name:"Store Name",
    type: "textBox",
    label: "What would you like to name your store?",
    control: "storename",
    validator:"required",
    section: 2
  },
  {
    name:"Store Url",
    type: "textBoxGroup",
    label: "What url would you like to use?",
    control: "storeurl",
    validator:"required",
    section: 2
  },
  {
    name:"Banner Image",
    type: "file",
    label: "Banner Background",
    control: "bannerimage",
    validator:"",
    section: 2   
  },
  {
    name:"Banner Heading",
    type: "textBox",
    label: "Headline",
    control: "bannerheading",
    validator:"required",
    section: 2
  }, 
  {
    name:"Banner Description",
    type: "textArea",
    label: "Sub-Headline",
    control: "bannerdesc",
    validator:"",
    section: 2
  },
  {
    name:"Promotion Description",
    type: "textArea",
    label: "Store Description",
    control: "reason",
    validator:"",
    section: 2
  },
  // {
  //   name:"Logo Option",
  //   type: "select",
  //   label: "Company Logo",
  //   control: "giftlogo",
  //   options: ["No","Yes"],
  //   validator:"required",
  //   section: 2
  // },
  {
    name:"Logo Image",
    type: "file",
    label: "Company Logo",
    control: "logoimage",
    validator:"",
    section: 2    
  },
  {
    name:"Company Name",
    type: "textBox",
    label: "Company Name",
    control: "cname",
    validator:"required",
    section: 3
  },
  { 
    name:"First Name",   
    type: "textBox",
    label: "First Name",
    control: "fname",
    validator:"required",
    section: 3
  },
  {
    name:"Last Name",
    type: "textBox",
    label: "Last Name",
    control: "lname",
    validator:"required",
    section: 3
  },
  {
    name:"Phone",
    type: "textBox",
    label: "Phone",
    control: "phone",
    validator:"required",
    section: 3
  },
  {
    name:"Email",
    type: "textBox",
    label: "Email",
    control: "email",    
    section: 3,
    validator:"required,email"
  },
  {
    name:"Password",
    type: "password",
    label: "What password would you like to use to access your store?",
    control: "password",
    validator:"required",
    section: 3
  },
  {
    name:"Confirm Password",
    type: "password",
    label: "Confirm your password",
    control: "confirmpassword",
    validator:"required",
    section: 3
  },
  {
    name:"Contact Phone",
    type: "textBox",
    label: "What phone can your store's visitors contact if they have questions?",
    control: "contactphone",
    validator:"required",
    section: 3
  },
  {
    name:"Contact Email",
    type: "textBox",
    label: "What email can your store's visitors contact if they have questions?",
    control: "contactemail",    
    section: 3,
    validator:"required,email"
  },
  {
    name:"Theme",
    type: "select",
    label: "Select Theme",
    control: "theme",
    validator:"",
    options: ["Red", "Green", "Blue"],
    section: 0
  },
  {
    name:"textcolor",
    type: "textBox",
    label: "Headline Text Color",
    control: "textcolor",
    validator:"",
    section: 0
  },
  {
    name:"transparentbg",
    type: "textBox",
    label: "White Background",
    control: "transparentbg",
    validator:"",
    section: 0
  },
  {
    name:"primarycolor",
    type: "textBox",
    label: "Primary Color",
    control: "primarycolor",
    validator:"",
    section: 0
  },
  {
    name:"buttoncolor",
    type: "textBox",
    label: "Button Color",
    control: "buttoncolor",
    validator:"",
    section: 0
  },
  {
    name:"nobanner",
    type: "textBox",
    label: "No Banner Image",
    control: "nobanner",
    validator:"",
    section: 0
  }
];

formTemplate= this.form_template;


@ViewChild("stepper", { static: false }) stepper: MatStepper;

// @HostListener('window:beforeunload', ['$event'])
//     unloadNotification($event: any) {
        // this.savedFormState = formGroup.getRawValue()

//         formGroup.patchValue(this.saveFormState);
//     }

public setTitle( newTitle: string) {
  this.titleService.setTitle( newTitle );
}
constructor(
  private titleService: Title,
  private formBuilder: FormBuilder,
  private apiService: ApiService,
  private modalService: NgbModal,
  public snackBar: MatSnackBar,
  private route: ActivatedRoute,
  private router: Router,
  private data: DataService)
  {

    this.setTitle( 'Registration | Build-A-Gift Store' );
    let group = {};
    this.dynamicForm = this.formBuilder.group({addressesarray: new FormArray([])});    
    this.form_template.forEach(input_template => {
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
    });

  group["addressesarray"] = new FormArray([]);
  this.dynamicForm = new FormGroup(group);  
  this.fetchAllData();

  this.apiService.all_cats().subscribe(
    user => {
      console.log(user["cats"]);
      this.allcats=(user["cats"]);
    },
    error => console.log(error)
  );
}

  // convenience getters for easy access to form fields
get f() {
  return this.dynamicForm.controls;
}
get t() {
  return this.f.addressesarray as FormArray;
}

ngOnInit() { 
  
  // this.apiService.insert_setting((Object.values(this.form_template))).subscribe(
  //   user => {
  //     console.log(user);
  //   },
  //   error => console.log(error)
  // );
  // console.log("here");

  this.sections = [...new Set(this.formTemplate.map(item => item.section))];
  if (JSON.parse(localStorage.getItem("adt"))) {
    if (JSON.parse(localStorage.getItem("adt")).addressesarray.length > 0) {
      // console.log(JSON.parse(localStorage.getItem("adt")).addressesarray);
      JSON.parse(localStorage.getItem("adt")).addressesarray.forEach(
        (element, i) => {
          this.t.push(
            this.formBuilder.group({
              type:['C'],
              cost:[10],
              main:[0],
              addressname: [element.addressname, Validators.required],
              shiptoname: [element.shiptoname, Validators.required],
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
    } else {
      this.addAnotherAd();
    }
  } else {
    this.addAnotherAd();
  }
  this.formControlValueChanged();  
  console.log(this.t.controls);
}

//Pricing Breaks
pricingbreaks(pid,a2){
  var data=({ productid: pid , attr2: a2});
  this.apiService.getpricingbreaks(data).subscribe(
    user => {
      this.pb = user["pricingbreaks"];
    },
    error => console.log(error)
  );
}

// //Promo Length affecting dates
//   selectChange(control){
//     if(control=="promolength"){
//       this.promolength=0;
//       switch(this.dynamicForm.controls[control].value.replace(/[^0-9]/g,'')){
//         case "1": this.promolength=30;break;
//         case "3": this.promolength=90;break;
//         case "6": this.promolength=180;break;
//         case "12": this.promolength=365;break;
//       }
//       let today = new Date();        
//       this.launchdate= this.addDays(today, 1);
//       this.enddate= this.addDays(this.launchdate, this.promolength);
//       this.deliverdate= this.addDays(this.enddate, 21);
    
//       // (<HTMLInputElement>document.getElementById("launchdate")).value=this.launchdate.toISOString().substr(0, 10);
//       (<HTMLInputElement>document.getElementById("launchdate")).min=this.launchdate.toISOString().substr(0, 10);
//       // (<HTMLInputElement>document.getElementById("enddate")).value=this.enddate.toISOString().substr(0, 10);
//       (<HTMLInputElement>document.getElementById("enddate")).min=this.enddate.toISOString().substr(0, 10);
//       // (<HTMLInputElement>document.getElementById("deliverdate")).value=this.deliverdate.toISOString().substr(0, 10);
//       (<HTMLInputElement>document.getElementById("deliverdate")).min=this.deliverdate.toISOString().substr(0, 10);      
//       this.dynamicForm.controls.launchdate.patchValue(this.launchdate.toISOString().substr(0, 10), {onlySelf: true});
//       this.dynamicForm.controls.enddate.patchValue(this.enddate.toISOString().substr(0, 10), {onlySelf: true});
//       this.dynamicForm.controls.deliverdate.patchValue(this.deliverdate.toISOString().substr(0, 10), {onlySelf: true});
//       // console.log(this.dynamicForm.controls[control].value.replace(/[^0-9]/g,''));
//     }
//   }

//Helper functions to add days to date
addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

//Adding multiple domains
//adding domain
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
//removing domain
removeDomain(itemx){  
  this.domaindata=this.domaindata.filter(item => item !== itemx)
  console.log(itemx,this.domaindata)
}

//on date change validations
dateChange(control){
  if(control=="launchdate"){
    // if(this.dynamicForm.controls.launchdate.value<this.launchdate.toISOString().substr(0, 10)){
    //   alert("Error");
    // }
    var launchdate=this.dynamicForm.controls.launchdate.value;
    this.enddate= this.addDays(launchdate, 21);
    this.deliverdate= this.addDays(this.enddate, 21);
    this.dynamicForm.controls.enddate.patchValue(this.enddate.toISOString().substr(0, 10), {onlySelf: true});
    this.dynamicForm.controls.deliverdate.patchValue(this.deliverdate.toISOString().substr(0, 10), {onlySelf: true});    
    (<HTMLInputElement>document.getElementById("enddate")).min=launchdate;
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

//fetching data
//fetch all data
fetchAllData(){
  this.apiService.all_products().subscribe(
    user => {
      this.myData = Object.keys(user).map(e => user[e]);
      this.myData = this.mergeandflat(this.myData);
      console.log(this.myData);
      this.createColorArray(this.myData);
    },
    error => console.log(error)
  );
}
//fetch category data
fetchCatData(catid){
  this.apiService.get_cat(catid).subscribe(
    user => {
      this.myData = Object.keys(user).map(e => user[e]);
      this.myData = this.mergeandflat(this.myData);
       console.log(this.myData);
      this.createColorArray(this.myData);
    },
    error => console.log(error)
  );
  console.log(this.myData);
}
//load more products
changeData(){
  this.alldataloaded=true;
  this.apiService.all_products().subscribe(
    user => {
      // this.myData = Object.keys(user).map(e => user[e]);
      // this.myData = this.mergeandflat(this.myData);
      // console.log(this.myData);
      // this.createColorArray(this.myData);
      var alldata=this.mergeandflat(Object.keys(user).map(e => user[e]));
      this.colorArray=[];
      this.createColorArray(alldata);
      console.log(alldata,this.myData,"before")
      alldata.forEach(element => {
        var count=0;
        this.myData.forEach(data => {
          if(data.ProductID==element.ProductID){
          count++;
          }  
        });
        if(count==0){
          this.myData.push(element);
        }          
      });    
      console.log(alldata,this.myData,"after")
      this.updateimagesagain(this.myData);    
    },
  error => console.log(error)
  );   
}

//creating attribute arrays for shwoing products with multiple colors
createColorArray(myData){
  myData.forEach(element => {
    if (Array.isArray(element.ImageFile)) {      
      element.Attr2.forEach((element1, i) => {
        if (i == 0)
          this.colorArray.push({productid: element.ProductID,colorattr: element1,checked: true});
        else
          this.colorArray.push({productid: element.ProductID,colorattr: element1,checked: false});
      });
      this.updateImage(element.ProductID,element.ImageFile[0],"product-img-" + element.ProductID);
    } 
    else {
      this.colorArray.push({productid: element.ProductID,colorattr: element.Attr2,checked: true});
    }
    this.addedcart.push({ productid: element.ProductID, added: false });
  });
}

//image functions
//updating images on load
updateImage(product, image, imageid) {
  if (image) {
    // console.log("here")
    var inputElement = <HTMLInputElement>document.getElementById(imageid);
    if (document.getElementById(imageid)) {
      var url = "https://securedgear.com/sites/997/products/997_";
      inputElement.style.backgroundImage ="url(" + url + product + "_" + image + ")";
    }
  }
}
//image update again
updateimagesagain(data){
  // console.log(data,"here")
  if (data != null ) {
    data.forEach(element => {
      if (Array.isArray(element.ImageFile)) {
        if (<HTMLInputElement>(document.getElementById("product-img-" + element.ProductID)) != null) {
          this.updateImage(element.ProductID, element.ImageFile[0],"product-img-" + element.ProductID);
          // console.log(element.ProductID, element.ImageFile[0], "product-img-" + element.ProductID );
          this.i = 1;
        }
      } else if (this.x < data.length) {
        if (<HTMLInputElement>(document.getElementById("product-img-" + element.ProductID)) != null) {
          this.updateImage(element.ProductID,element.ImageFile,"product-img-" + element.ProductID);
          this.x++;
        }
      }
    });
  }
}

//fucntions On form value changes
formControlValueChanged() {
  const domainname = this.dynamicForm.get('domainname');
  const accesscode = this.dynamicForm.get('accesscode');
  const logoimage = this.dynamicForm.get('logoimage');
  this.dynamicForm.get('loginoption').valueChanges.subscribe(
    (mode: string) => {
        console.log(mode);
        if (mode.includes('code')) {
          accesscode.setValidators([Validators.required]);
          domainname.clearValidators();
        }
        else if (mode.includes('email')) {
          const domainPattern = "^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$";
          domainname.setValidators([Validators.pattern(domainPattern)]);
          accesscode.clearValidators();
      }
      domainname.updateValueAndValidity();
      accesscode.updateValueAndValidity();
    });

  // this.dynamicForm.get('giftlogo').valueChanges.subscribe(
  //   (mode: string) => {
  //       console.log(mode);
  //       if (mode.includes('Yes')) {
  //         logoimage.setValidators([Validators.required]);            
  //       }
  //       else if (mode.includes('No')) {
  //         logoimage.clearValidators();
  //     }
  //     logoimage.updateValueAndValidity();
  //   });

  this.dynamicForm.get('shipping').valueChanges.subscribe(
    (mode: string) => {
        console.log(mode);
        if (mode.includes('corporate')) {
          this.t.clear();  
          this.addAnotherAd();     
        }
        else {
          this.t.clear();  
      }      
    });
  this.dynamicForm.get('email').valueChanges.subscribe(
    (mode: string) => {
      this.dupemail=false;
    });
  this.dynamicForm.get('storeurl').valueChanges.subscribe(
    (mode: string) => {
      this.dupeurl=false;
    });      
}

//modal functions
//open modal
openSnackBar(msg, action, className) {
  this.snackBar.open(msg, action, {
    duration: 2500,
    panelClass: [className]
  });
}
//close modal
closeModal(){
  this.modalReference.close();
}
//close modal and redirect
closeredirectModal(){
  this.router.navigate(['/registration/preview']);
  this.modalReference.close();
}
//Open Dialog
openDialog(formdone){
  this.modalReference=this.modalService.open(formdone, { centered: true });
}
//Modal
productdetails(modal,product){
  this.products=this.myData.filter(item => item.ProductID == product.ProductID);      
  this.modalReference=this.modalService.open(modal, { centered: true,size:"lg" });    
  if(this.isArray(this.products[0].Attr2)){
    this.pricingbreaks(this.products[0].ProductID,this.products[0].Attr2[0]);
  }
  else{
    this.pricingbreaks(this.products[0].ProductID,this.products[0].Attr2);
  }    
}

//product cart
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
  console.log("here",this.seeselection);
  this.apiService.changeMessage(this.seeselection);
  localStorage.setItem("selections", JSON.stringify(this.seeselection));
}

//check if product color is selected  
colorCheckColorSelect(a2id) {
  var x = false;
  this.colorArray.forEach(element => {
    if (element.colorattr == a2id) {
      x = element.checked;
    }
  });
  return x;
}
//add color to color array
colorCheck(a2id) {
  this.colorArray.forEach(element => {
    if (element.colorattr == a2id) {
      element.checked = !element.checked;
    }
  });
}
//check if product color is removed
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
//add color to color array
addtocart(pname, pid, attr2, a2_label,imagefile) {
var prods= [...new Set(this.seeselection.map(item => item.productid))];
console.log(prods)
  if(prods.length>5 && !prods.includes(pid)){
    var r = confirm("Adding more than 6 items usally leads to more products to show and less chances of getting pricing breaks for products. This would cost you more.");
    if (r == true) {
    
    } else {
    return;
    }
  }
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
              this.openSnackBar("Product " + pname + " removed from Selection","","red-snackbar" );
            }
            element.checked = !element.checked;
            i++;
          }
          if (i == 0) {
            this.openSnackBar("No Color Selected", "", "red-snackbar");
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

//file functions
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

//function to change object to array for use
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

//form submit  
onSubmit(formdone) {
  this.checkSection(4);   
  this.submitted = true;        
}

//reset form
onReset() {
  this.submitted = false;
  this.dynamicForm.reset();
  this.t.clear();
  this.addAnotherAd();
}

// clear errors and reset ticket fields
onClear() {  
  this.submitted = false;
  this.t.reset();
  for (var i = 0; i <= this.t.length; i++) {
    this.Address[i] = true;
  }
}


shiprocket(address,addressmodal,i){  
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
      self.loading=false;
       var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
       var data = request.responseText; // Returned data, e.g., an HTML document.
       console.log(request.responseText);
       if(!JSON.parse(data).data.city_state_zip_match){
         if(JSON.parse(data).data.suggestions!=null){
          self.saddress=JSON.parse(data).data.suggestions;
          // self.saddress.addr2=self.saddress.addr2==''?self.dynamicForm.value["addressesarray"][i].streetaddress2:self.saddress.addr2;
          console.log(self.saddress,JSON.parse(data));
          self.openDialog(addressmodal);
         }
       }       
       
    }
    request.open(method, url, shouldBeAsync);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("x-api-key", "9TipcqNm5542LB9IoPRJu7Ja3nwGF3Ne2ga71Zdg");    
    request.send(JSON.stringify(postData));

    
}

updatesaddress(i,j){
  this.dynamicForm.controls["addressesarray"]['controls'][i]['controls'].streetaddress.patchValue(this.saddress[j].addr1, {onlySelf: true});
  this.saddress[j].addr2=this.saddress[j].addr2==''?this.dynamicForm.value["addressesarray"][i].streetaddress2:this.saddress[j].addr2;
  this.dynamicForm.controls["addressesarray"]['controls'][i]['controls'].streetaddress2.patchValue(this.saddress[j].addr2, {onlySelf: true});
  this.dynamicForm.controls["addressesarray"]['controls'][i]['controls'].city.patchValue(this.saddress[j].city, {onlySelf: true});
  this.dynamicForm.controls["addressesarray"]['controls'][i]['controls'].state.patchValue(this.saddress[j].state, {onlySelf: true});
  this.dynamicForm.controls["addressesarray"]['controls'][i]['controls'].zip.patchValue(this.saddress[j].zipcode +'-'+ this.saddress[j].zipcode_addon, {onlySelf: true});


  this.dynamicForm.value["addressesarray"][i].streetaddress=(this.saddress[j].addr1);
  this.dynamicForm.value["addressesarray"][i].streetaddress2=(this.saddress[j].addr2);
  this.dynamicForm.value["addressesarray"][i].city=(this.saddress[j].city);
  this.dynamicForm.value["addressesarray"][i].state=(this.saddress[j].state);
  this.dynamicForm.value["addressesarray"][i].zip=(this.saddress[j].zipcode +'-'+ this.saddress[j].zipcode_addon);
 
  console.log(this.dynamicForm.value["addressesarray"][i]);
  
}

MakePrimary(i){

  var addressnameholder =this.dynamicForm.value["addressesarray"][i].addressname
  var shiptonameholder =this.dynamicForm.value["addressesarray"][i].shiptoname
  var streetaddressholder =this.dynamicForm.value["addressesarray"][i].streetaddress
  var streetaddress2holder =this.dynamicForm.value["addressesarray"][i].streetaddress2
  var cityholder =this.dynamicForm.value["addressesarray"][i].city
  var stateholder =this.dynamicForm.value["addressesarray"][i].state
  var zipholder =this.dynamicForm.value["addressesarray"][i].zip

  this.dynamicForm.controls["addressesarray"]['controls'][i]['controls'].addressname.patchValue(this.dynamicForm.value["addressesarray"][0].addressname, {onlySelf: true});
  this.dynamicForm.controls["addressesarray"]['controls'][i]['controls'].shiptoname.patchValue(this.dynamicForm.value["addressesarray"][0].shiptoname, {onlySelf: true});
  this.dynamicForm.controls["addressesarray"]['controls'][i]['controls'].streetaddress.patchValue(this.dynamicForm.value["addressesarray"][0].streetaddress, {onlySelf: true});  
  this.dynamicForm.controls["addressesarray"]['controls'][i]['controls'].streetaddress2.patchValue(this.dynamicForm.value["addressesarray"][0].streetaddress2, {onlySelf: true});
  this.dynamicForm.controls["addressesarray"]['controls'][i]['controls'].city.patchValue(this.dynamicForm.value["addressesarray"][0].city, {onlySelf: true});
  this.dynamicForm.controls["addressesarray"]['controls'][i]['controls'].state.patchValue(this.dynamicForm.value["addressesarray"][0].state, {onlySelf: true});
  this.dynamicForm.controls["addressesarray"]['controls'][i]['controls'].zip.patchValue(this.dynamicForm.value["addressesarray"][0].zip, {onlySelf: true});


  this.dynamicForm.value["addressesarray"][i].addressname=this.dynamicForm.value["addressesarray"][0].addressname;
  this.dynamicForm.value["addressesarray"][i].shiptoname=this.dynamicForm.value["addressesarray"][0].shiptoname;
  this.dynamicForm.value["addressesarray"][i].streetaddress=this.dynamicForm.value["addressesarray"][0].streetaddress
  this.dynamicForm.value["addressesarray"][i].streetaddress2=this.dynamicForm.value["addressesarray"][0].streetaddress2;
  this.dynamicForm.value["addressesarray"][i].city=this.dynamicForm.value["addressesarray"][0].city;
  this.dynamicForm.value["addressesarray"][i].state=this.dynamicForm.value["addressesarray"][0].state;
  this.dynamicForm.value["addressesarray"][i].zip=this.dynamicForm.value["addressesarray"][0].zip;
/////
  this.dynamicForm.controls["addressesarray"]['controls'][0]['controls'].addressname.patchValue(addressnameholder, {onlySelf: true});
  this.dynamicForm.controls["addressesarray"]['controls'][0]['controls'].shiptoname.patchValue(shiptonameholder, {onlySelf: true});
  this.dynamicForm.controls["addressesarray"]['controls'][0]['controls'].streetaddress.patchValue(streetaddressholder, {onlySelf: true});  
  this.dynamicForm.controls["addressesarray"]['controls'][0]['controls'].streetaddress2.patchValue(streetaddress2holder, {onlySelf: true});
  this.dynamicForm.controls["addressesarray"]['controls'][0]['controls'].city.patchValue(cityholder, {onlySelf: true});
  this.dynamicForm.controls["addressesarray"]['controls'][0]['controls'].state.patchValue(stateholder, {onlySelf: true});
  this.dynamicForm.controls["addressesarray"]['controls'][0]['controls'].zip.patchValue(zipholder, {onlySelf: true});


  this.dynamicForm.value["addressesarray"][0].addressname=(addressnameholder);
  this.dynamicForm.value["addressesarray"][0].shiptoname=(shiptonameholder);
  this.dynamicForm.value["addressesarray"][0].streetaddress=(streetaddressholder);
  this.dynamicForm.value["addressesarray"][0].streetaddress2=(streetaddress2holder);
  this.dynamicForm.value["addressesarray"][0].city=(cityholder);
  this.dynamicForm.value["addressesarray"][0].state=(stateholder);
  this.dynamicForm.value["addressesarray"][0].zip=(zipholder);

  console.log(this.dynamicForm.value["addressesarray"]);
  
}


//address functions
//add single address
addSingleAd(i,addressmodal) {
  
  // console.log(this.dynamicForm.controls);
  this.addresserrors = true;
  if (this.dynamicForm.controls.addressesarray.invalid) {
    return;
  }  
  this.loading=true;
  this.saddressi=i;
  this.shiprocket(this.dynamicForm.value["addressesarray"][i],addressmodal,i);  
  this.Address[i] = false;
  console.log(this.dynamicForm.value["addressesarray"][i]);
  this.addAnother = true;
  localStorage.setItem("adt", JSON.stringify(this.dynamicForm.value));    
  this.addresserrors = false;
}
//remove single address
CancelSingleAd(i) {
  this.t.removeAt(i);
  this.addAnother = true;
}
//edit address
EditSingleAd(i) {
  this.Address[i] = true;
  for (var x = 0; x <= this.t.length; x++) {
    if (this.Address[x] && x != i) {
      this.CancelSingleAd(x);
    }
  }
}
//add annother addrress
addAnotherAd() {
  this.addresserrors = true;
  {
    this.Address[this.t.length] = true;
    this.t.push(
      this.formBuilder.group({
        type:['C'],
        cost:[10],
        main:[0],
        addressname: ["", Validators.required],
        shiptoname: ["", Validators.required],
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

//main next click validation function 
checkSection(i) {
  var check = 0;
  this.urlError=false;
  this.formTemplate.forEach(form_elem => {
    // console.log(this.dynamicForm.controls[form_elem.control]);
    if (form_elem.section == i) {
      if(this.dynamicForm.controls.password.value!=this.dynamicForm.controls.confirmpassword.value){
        this.passmismatch=true;
        console.log(this.passmismatch)
        check=1;
      }
      else{
        this.passmismatch=false;
        // check = 0;
      }
      if (this.dynamicForm.controls[form_elem.control].invalid) {
        check = 1;          
        this.section1errors = (i==1) ? true : false;
        this.section2errors = (i==2) ? true : false;
        this.section3errors = (i==3) ? true : false;
        this.section4errors = (i==4) ? true : false;        
        // window.scroll(0,0);
        document.getElementById(form_elem.control).scrollIntoView();
      }        
    }
  });

  if(i == 1){
    // console.log(this.dynamicForm.controls.launchdate.value<this.launchdate.toISOString().substr(0, 10));
    var ed = new Date(this.dynamicForm.controls.enddate.value);
    var dd = new Date(this.dynamicForm.controls.deliverdate.value);
    const diffTime = Math.abs(dd.getTime() - ed.getTime());
    this.diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))||0; 
    console.log(this.dynamicForm.controls.enddate.value,ed,dd, diffTime, this.diffDays)
    console.log("Ship time date must be less than ", this.diffDays);
    if(this.dynamicForm.controls.empcount.value=="0-9"){
      this.eligible=false;
    }
    else if(this.dynamicForm.controls.budget.value=="$0-$4.99"){
      this.eligible=false;
    } 
    if(this.dynamicForm.controls.budget.value){
      this.alldataloaded=false;
    this.fetchCatData(this.dynamicForm.controls.budget.value);
  }
    // if(this.dynamicForm.controls.budget.value=="$5.00-$9.99" || this.dynamicForm.controls.budget.value=="$10.00-$14.99"){
    //   this.fetchCatData(956);
    //   // this.updateimagesagain(this.myData);
    // }
    // else if(this.dynamicForm.controls.budget.value=="$15.00-$19.99" || this.dynamicForm.controls.budget.value=="$25.00+"){
    //   this.fetchCatData(957);
    //   // this.updateimagesagain(this.myData2);
    // }
    // console.log(this.dynamicForm.controls.launchdate.value,"here",this.launchdate.toISOString().substr(0, 10))
    if(this.dynamicForm.controls.launchdate.value<this.launchdate.toISOString().substr(0, 10)){
      check=1;        
    }
    else if(this.dynamicForm.controls.enddate.value<this.launchdate.toISOString().substr(0, 10)){
      check=1;        
    }
    else if(this.dynamicForm.controls.deliverdate.value<this.deliverdate.toISOString().substr(0, 10)){
      check=1;        
    }
  }
  
  if(i==2){
    this.apiService.checkStoreUrl(this.dynamicForm.controls.storeurl.value).subscribe(
      user => {
        if(user){
          this.dupeurl=true;    
          window.scrollTo(0, 0)       
          return;
        }
        else{
          this.dupeurl=false;
          if(check==1){
            return;
          }
          else {
            
            this.progress=75;
            this.sectiontitle="Create your admin account.";
            this.sectiondesc="Before previewing your store, please share a little information with us. <br>This allows us to save the work you've done so far. <br>You can also use this information to access your store's orders and users after it's live.";
            this.sectionbtn="Save & Preview My Store";
            window.scrollTo(0, 0)
            this.stepper.next();
            return;
          }
        }
      },
      error => console.log(error)
    );
    return;
  }

  if(i==3){
    this.apiService.checkCustomerEmail(this.dynamicForm.controls.email.value).subscribe(
      user => {
        if(user){
          this.dupemail=true;           
          return;
        }
        else{
          this.dupemail=false;
          if(check==1){           
            return;
          }
          else {
            
            if (this.dynamicForm.invalid) {
              return;
            }
            else{              
            this.sectiontitle="Success!";
            this.sectiondesc="Your account has been created and your work has been saved!";
            this.sectionbtn="NEXT: Preview My Store";
            this.dynamicForm.controls.domainname.patchValue(this.domaindata.join());
            localStorage.setItem("adt", JSON.stringify(this.dynamicForm.value));
            // localStorage.setItem("formdata", JSON.stringify(this.dynamicForm.value));
            // localStorage.setItem("productdata", JSON.stringify(this.seeselection));
            // display form values on success
            // alert(
            //   "SUCCESS!! :-)\n\n" +JSON.stringify(this.selection,null, 4)+ JSON.stringify(this.dynamicForm.value, null, 4)
            // );
            if(this.logoimage){
            const formData = new FormData();
                formData.append('logo', this.logoimage);
                formData.append('url', this.dynamicForm.controls.storeurl.value);
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
            if(this.bannerimage){
            const formData = new FormData();
                formData.append('logo', this.bannerimage);
                formData.append('url', this.dynamicForm.controls.storeurl.value);
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
              this.dynamicForm.controls.textcolor.patchValue('white');
              this.dynamicForm.controls.theme.patchValue('Default');
              this.dynamicForm.controls["addressesarray"]['controls'][0]['controls'].main.patchValue(1, {onlySelf: true});
              this.dynamicForm.controls["addressesarray"]['controls'][0]['controls'].cost.patchValue(0, {onlySelf: true});  
              this.dynamicForm.value["addressesarray"][0].main=1;
              this.dynamicForm.value["addressesarray"][0].cost=0;  
              console.log(this.dynamicForm.value["addressesarray"]);
            var userdata=({fname:this.dynamicForm.value.fname,lname:this.dynamicForm.value.lname,phone:this.dynamicForm.value.phone,email:this.dynamicForm.value.email,password:this.dynamicForm.value.password});
            var finaldata=({ storedata: this.dynamicForm.value , productdata: this.selection,addressdata:this.dynamicForm.value["addressesarray"],userdata:userdata});
            // console.log(finaldata.storedata,finaldata.productdata,finaldata.addressdata,finaldata.userdata);
            localStorage.setItem("finaldata", JSON.stringify(finaldata));            
            this.apiService.registration(finaldata).subscribe(
              user => {
                console.log(user,"here");
                // this.openDialog(formdone);
                this.uname=this.dynamicForm.controls.email.value;
                this.pword=this.dynamicForm.controls.password.value;
                this.siteurl=this.dynamicForm.controls.storeurl.value;
                // this.messagepage=true;
                window.scrollTo(0, 0)
                this.stepper.next();
                this.progress=100;
                this.progressbar="bg-success";
                this.data.changeMessage(true);
                return;
              },
              error => {
                console.log(error);
                // this.openDialog(formdone);
              },
            );
            }
          }
        }
      },
      error => console.log(error)
    );
    return;
  }

  if(i=="gift"){
    if(this.selection.length==0){
      check = 1; 
      alert("Select Products first");
    }
  }
  
  if (check == 0 && (i!=2||i!=3)) {
    // console.log(this.stepper)
    if(i==1){
      this.dynamicForm.controls.domainname.patchValue(this.domaindata.join());
      this.progress=35;
      this.sectiontitle="Choose the gifts they'll love.";
      this.sectiondesc="Make your selections, then you'll get to design your store!<br><small>Pro Tip: Fewer gift choices may get you better pricing per item. Try offering 6 options or less.</small>";
      this.sectionbtn="Save & Preview My Store";
    }
    if(i=="gift"){
      this.progress=90;
      this.sectiontitle="Customize your store.";
      this.sectiondesc="Choose a url and add some personal accents to make it truly yours. ";
      this.sectionbtn="Next: Create My Account & Preview My Store";
    }
    window.scrollTo(0, 0)
    this.stepper.next();
  } else return false;
}

//check if array function
isArray(obj: any) {
  return Array.isArray(obj);
}

previewredirect(){
  var homeurl="/stores/"+this.siteurl+"/home";
  this.router.navigate([homeurl,{uid:this.uname,pwd:this.pword}]);
  console.log(homeurl)
  
}


}

// this.form_template = 

export interface Products {
  productid?: number;
  products?: Array<String>;
}

export interface ColorGroup {
  productid?: number;
  colorattr?: any;
  checked?: boolean;
}

export interface Selection {
  productid?: number;
  colorattr?: any;
  productname?:any;
  image?:any;
}

export interface Added {
  productid?: number;
  added?: boolean;
}

export interface Setting {
  
  name?:string;
    type?: string;
    label?: string;
    control?: string;
    options?: Array<String>;
    validator?: string;
    section?: number;
    validators?:ValidationErrors;
  
}

export interface Settings extends Array<Setting>{}