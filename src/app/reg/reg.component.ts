import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,  FormGroup,  FormArray,  FormControl,  Validators, ValidationErrors } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { ApiService } from "../../app/api.service";
import { MatSnackBar } from "@angular/material";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.scss']
})
export class RegComponent implements OnInit {

  dynamicForm: FormGroup;
  submitted = false;
  section1errors = false;
  section2errors = false;
  section3errors = false;
  section4errors = false;
  sectionerrors;
  addAnother = false;

  form_template:Settings=[
    {
      name:"Employee Count",
      type: "select",
      label:"How many employees are eligible to participate in this rewards program?",
      control: "empcount",
      options: ["less than 10", "10+", "20+", "30+", "40+"],
      section: 1,
      validator:"required"
    },
    {
      name:"Gift Budget",
      type: "select",
      label: "What is your budget for each employee gift?",
      control: "budget",
      options: ["less than $5", "$10+", "$15+", "$20+", "$25+"],
      validator:"required",
      section: 1
    },
    {
      name:"Number of Gifts",
      type: "select",
      label: "How many gift options do you want to give your employees?",
      control: "giftcount",
      options: ["3", "4", "5", "6", "7"],
      validator:"required",
      section: 1
    },
    {
      name:"Logo Option",
      type: "select",
      label: "Do you want these gifts to have your organization’s logo on them?",
      control: "giftlogo",
      options: ["Yes", "No"],
      validator:"required",
      section: 1
    },
    {
      name:"Logo Image",
      type: "file",
      label: "Logo Image",
      control: "logoimage",
      validator:"required",
      section: 1    
    },
    {
      name:"Promotion Length",
      type: "select",
      label: "How long will the rewards program run?",
      control: "promolength",
      options: ["1 month", "3 months", "6 months", "12 month"],
      validator:"required",
      section: 1
    },
    {
      name:"Promotion Start Date",
      type: "date",
      label: "Select the start date of the Rewards Program",
      control: "launchdate", 
      validator:"required",   
      section: 1
    },
    {
      name:"Promotion End Date",
      type: "date",
      label: "Select the end date of the Rewards Program",
      control: "enddate",    
      validator:"required",
      section: 1
    },
    {
      name:"Gift Delivery Date",
      type: "date",
      label:"By when do you want the gift selections delivered to your employees?",
      control: "deliverdate",   
      validator:"required",
      section: 1
    },
    {    
      type: "textBox",
      label: "First Name",
      control: "fname",
      validator:"required",
      section: 2
    },
    {
      type: "textBox",
      label: "Last Name",
      control: "lname",
      validator:"required",
      section: 2
    },
    {
      type: "textBox",
      label: "Phone",
      control: "phone",
      validator:"required",
      section: 2
    },
    {
      type: "textBox",
      label: "Email",
      control: "email",    
      section: 2,
      validator:"required,email"
    },
    {
      type: "password",
      label: "Password",
      control: "password",
      validator:"required",
      section: 2
    },
    {
      type: "password",
      label: "Confirm Password",
      control: "confirmpassword",
      validator:"required",
      section: 2
    },
    {
      name:"Personalized Card",
      type: "select",
      label: "Do you want a personalized card included with the gift?",
      control: "personalizedcard",
      options: ["Yes", "No"],
      validator:"required",
      section: 3    
    },
    {
      name:"Promotion Description",
      type: "textArea",
      label: "Please provide a brief description of what this reward program is for?",
      control: "reason",
      validator:"required",
      section: 3
    },
    {
      name:"Store Name",
      type: "textBox",
      label: "Store Name",
      control: "storename",
      validator:"required",
      section: 4
    },
    {
      name:"Store Url",
      type: "textBoxGroup",
      label: "Store Url",
      control: "storeurl",
      validator:"required",
      section: 4
    }, 
    {
      name:"Employee Personal Shipping",
      type: "select",
      label: "Do you want your employees to enter their own shipping address?",
      control: "empshipping",
      options: ["Yes", "No"],
      validator:"required",
      section: 4    
    },
    {
      name:"Banner Image",
      type: "file",
      label: "Banner Image",
      control: "bannerimage",
      validator:"required",
      section: 4    
    },
    {
      name:"Banner Heading",
      type: "textBox",
      label: "Banner Heading",
      control: "bannerheading",
      validator:"required",
      section: 4
    }, 
    {
      name:"Banner Description",
      type: "textArea",
      label: "Banner Description",
      control: "bannerdesc",
      validator:"required",
      section: 4
    },
    {
      name:"Store Login Type",
      type: "select",
      label: "How do you want your employees to login to your store?",
      control: "loginoption",
      options: ["Domain based email authentication", "Code based authentication"],
      validator:"required",
      section: 4    
    },
    {
      name:"Domain Name",
      type: "textBox",
      label: "Domain Name",
      control: "domainname",
      validator:"required",
      section: 4
    }, 
    {
      name:"Access Code",
      type: "textBox",
      label: "Code to access Store",
      control: "accesscode",
      validator:"required",
      section: 4
    }, 
    {
      name:"Multiple Shipping Desitinations",
      type: "select",
      label: "Do you want to show multiple shipping addresses on store?",
      control: "multishipping",
      options: ["Yes", "No"],
      validator:"required",
      section: 4    
    } 
  ];

  formTemplate= this.form_template;
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
secs;
  // public url="url(https://www.securedgear.com/sites/998/products/998_";
  // public url_close=")";

  public url = "url(https://www.securedgear.com/sites/997/products/997_";
  public url_close = ")";

  sites=["site1","site2","site3"];

  @ViewChild("stepper", { static: false }) stepper: MatStepper;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private modalService: NgbModal,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,private router: Router
  ) {
    this.dynamicForm = this.formBuilder.group({
      addressesarray: new FormArray([])
    });
    let group = {};
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

    console.log(group);

    this.dynamicForm = new FormGroup(group);
    this.secs=[...new Set(this.form_template.map(item => item.section))];
    console.log(this.secs)    
  }

  // convenience getters for easy access to form fields
  get f() {
    return this.dynamicForm.controls;
  }
  get t() {
    return this.f.addressesarray as FormArray;
  }

  ngAfterViewChecked() {
    // if (this.myData != null && this.i == 0) {
    //   this.myData.forEach(element => {
    //     if (Array.isArray(element.ImageFile)) {
    //       if (
    //         <HTMLInputElement>(
    //           document.getElementById("product-img-" + element.ProductID)
    //         ) != null
    //       ) {
    //         this.updateImage(
    //           element.ProductID,
    //           element.ImageFile[0],
    //           "product-img-" + element.ProductID
    //         );
    //         console.log(
    //           element.ProductID,
    //           element.ImageFile[0],
    //           "product-img-" + element.ProductID
    //         );
    //         this.i = 1;
    //       }
    //     } else if (this.x < this.myData.length) {
    //       if (
    //         <HTMLInputElement>(
    //           document.getElementById("product-img-" + element.ProductID)
    //         ) != null
    //       ) {
    //         this.updateImage(
    //           element.ProductID,
    //           element.ImageFile,
    //           "product-img-" + element.ProductID
    //         );
    //         this.x++;
    //       }
    //     }
    //   });
    // }

  // this.updateimagesagain(this.myData);


  //  let today = new Date();
  // function addDays(date, days) {
  //   var result = new Date(date);
  //   result.setDate(result.getDate() + days);
  //   return result;
  // }
  // let launchdate= addDays(today, 14);
  // let enddate= addDays(launchdate, 30);
  // (<HTMLInputElement>document.getElementById("launchdate")).value=launchdate.toISOString().substr(0, 10);
  // (<HTMLInputElement>document.getElementById("enddate")).value=enddate.toISOString().substr(0, 10);
  // console.log(document.getElementById("launchdate").value,document.getElementById('enddate'));
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
        
      this.launchdate= this.addDays(today, 14);
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
    
    if(control=="loginoption"){
      if(this.dynamicForm.controls.loginoption.value.includes("Domain")){

      }
      else{
        
      }
    }
  }

  fetchAllData(){
    this.apiService.all_products().subscribe(
      user => {
        this.myData = Object.values(user);
        this.myData = this.mergeandflat(this.myData);
        console.log(this.myData);
        this.createColorArray(this.myData);
      },
      error => console.log(error)
    );
  }

  fetchCatData(catid){
    this.apiService.get_cat(catid).subscribe(
      user => {
        this.myData = Object.values(user);
        this.myData = this.mergeandflat(this.myData);
        // console.log(this.myData);
        this.createColorArray(this.myData);
      },
      error => console.log(error)
    );
  }

  changeData(){
    this.alldataloaded=true;
    this.apiService.all_products().subscribe(
      user => {
        // this.myData = Object.values(user);
        // this.myData = this.mergeandflat(this.myData);
        // console.log(this.myData);
        // this.createColorArray(this.myData);
        var alldata=this.mergeandflat(Object.values(user));
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
  // console.log(this.colorArray,"colorArray");
}

updateImage(product, image, imageid) {
  if (image) {
    // console.log("here")
    var inputElement = <HTMLInputElement>document.getElementById(imageid);
    if (document.getElementById(imageid)) {
      var url = "https://www.securedgear.com/sites/997/products/997_";
      inputElement.style.backgroundImage ="url(" + url + product + "_" + image + ")";
    }
  }
}

formControlValueChanged() {
  const domainname = this.dynamicForm.get('domainname');
  const accesscode = this.dynamicForm.get('accesscode');
  const logoimage = this.dynamicForm.get('logoimage');
  this.dynamicForm.get('loginoption').valueChanges.subscribe(
      (mode: string) => {
          console.log(mode);
          if (mode.includes('Code')) {
            accesscode.setValidators([Validators.required]);
            domainname.clearValidators();
          }
          else if (mode.includes('Domain')) {
            const domainPattern = "^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$";
            domainname.setValidators([Validators.required,Validators.pattern(domainPattern)]);
            accesscode.clearValidators();
        }
        domainname.updateValueAndValidity();
        accesscode.updateValueAndValidity();
      });
  this.dynamicForm.get('giftlogo').valueChanges.subscribe(
      (mode: string) => {
          console.log(mode);
          if (mode.includes('Yes')) {
            logoimage.setValidators([Validators.required]);            
          }
          else if (mode.includes('No')) {
            logoimage.clearValidators();
        }
        logoimage.updateValueAndValidity();
      });
      
}

  ngOnInit() { 
    
    // this.apiService.insert_setting((Object.values(this.form_template))).subscribe(
    //   user => {
    //     console.log(user);
    //   },
    //   error => console.log(error)
    // );
    // console.log("here");

    if (JSON.parse(localStorage.getItem("adt"))) {
      if (JSON.parse(localStorage.getItem("adt")).addressesarray.length > 0) {
        // console.log(JSON.parse(localStorage.getItem("adt")).addressesarray);
        JSON.parse(localStorage.getItem("adt")).addressesarray.forEach(
          (element, i) => {
            // console.log(this.t);
            this.t.push(
              this.formBuilder.group({
                addressname: [element.addressname, Validators.required],
                streetaddress: [element.streetaddress, [Validators.required]],
                streetaddress2: [element.streetaddress2],
                city: [element.city, [Validators.required]],
                state: [element.state, [Validators.required]],
                zip: [
                  element.zip,
                  [
                    Validators.required,
                    Validators.pattern("^[0-9]{5}(?:-[0-9]{4})?$")
                  ]
                ]
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
  }

  openSnackBar(msg, action, className) {
    this.snackBar.open(msg, action, {
      duration: 2500,
      panelClass: [className]
    });
  }
//
  seeSelections(content){
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
    this.modalReference=this.modalService.open(content, { centered: true });
    console.log(this.selection);
    console.log("here",this.seeselection);
    this.apiService.changeMessage(this.seeselection);
    localStorage.setItem("selections", JSON.stringify(this.seeselection));
  }

  closeModal(){
    this.modalReference.close();
  }

  closeredirectModal(){
    this.router.navigate(['/reg/preview']);
    this.modalReference.close();
  }

  colorCheckColorSelect(a2id) {
    var x = false;
    this.colorArray.forEach(element => {
      if (element.colorattr == a2id) {
        x = element.checked;
      }
    });
    return x;
  }

  colorCheck(a2id) {
    this.colorArray.forEach(element => {
      if (element.colorattr == a2id) {
        element.checked = !element.checked;
      }
    });
  }

  removeCheck(attr2) {
    if (Array.isArray(attr2)) {
      var x = false;
      attr2.forEach(a2id => {
        if (
          this.selection.some(function(o) {
            return o["colorattr"] == a2id;
          })
        ) {
          x = true;
        }
      });
      return x;
    } else {
      return this.selection.some(function(o) {
        return o["colorattr"] == attr2;
      });
    }
  }

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
        this.openSnackBar(
          "Product " + pname + " removed from Selection",
          "",
          "red-snackbar"
        );
      }
    }
    if(this.seeselection.length==0 && this.modalService.hasOpenModals()){
      this.closeModal();
    }
    console.log(this.seeselection);
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
                this.openSnackBar("Product " + pname + " of color "+ a2_label[i] +" added to Selection","","green-snackbar");
                i++;
              } else {
                i++;
                this.openSnackBar("Product " + pname + " of color "+ a2_label[i] + "already added","","blue-snackbar");
              }
            }
            if (i == 0) {
              this.openSnackBar("No Color Selected", "", "red-snackbar");
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
        this.openSnackBar("Product " + pname + " of color "+ a2_label + " added to Selection","","green-snackbar");
      } else {
        this.openSnackBar("Product " + pname + " of color "+ a2_label + " already added","","blue-snackbar");
      }
    }
    console.log(this.selection);
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

  openDialog(formdone){
    this.modalReference=this.modalService.open(formdone, { centered: true });
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dynamicForm.invalid) {
      return;
    }
    localStorage.setItem("adt", JSON.stringify(this.dynamicForm.value));
    localStorage.setItem("formdata", JSON.stringify(this.dynamicForm.value));
    localStorage.setItem("productdata", JSON.stringify(this.seeselection));
    // display form values on success
    // alert(
    //   "SUCCESS!! :-)\n\n" +JSON.stringify(this.selection,null, 4)+ JSON.stringify(this.dynamicForm.value, null, 4)
    // );
    var userdata=({fname:this.dynamicForm.value.fname,lname:this.dynamicForm.value.lname,phone:this.dynamicForm.value.phone,email:this.dynamicForm.value.email,password:this.dynamicForm.value.password});
    var finaldata=({ storedata: this.dynamicForm.value , productdata: this.selection,addressdata:this.dynamicForm.value["addressesarray"],userdata:userdata});
    // console.log(finaldata.storedata,finaldata.productdata,finaldata.addressdata,finaldata.userdata);
    localStorage.setItem("finaldata", JSON.stringify(finaldata));
    
    this.apiService.registration(finaldata).subscribe(
      user => {
        console.log(user);
      },
      error => console.log(error)
    );    
  }

  onReset() {
    // reset whole form back to initial state
    this.submitted = false;
    this.dynamicForm.reset();
    this.t.clear();
    this.addAnotherAd();
  }

  onClear() {
    // clear errors and reset ticket fields
    this.submitted = false;
    this.t.reset();
    for (var i = 0; i <= this.t.length; i++) {
      this.Address[i] = true;
    }
  }
  addAnotherAd() {
    this.submitted = true;
    // if (this.dynamicForm.invalid || this.Address[this.t.length - 1]) {
    //   if (this.t.length == 0) {
    //     this.Address[this.t.length] = true;
    //     this.t.push(
    //       this.formBuilder.group({
    //         addressname: ["", Validators.required],
    //         streetaddress: ["", [Validators.required]],
    //         streetaddress2: [""],
    //         city: ["", [Validators.required]],
    //         state: ["", [Validators.required]],
    //         zip: [
    //           "",
    //           [
    //             Validators.required,
    //             Validators.pattern("^[0-9]{5}(?:-[0-9]{4})?$")
    //           ]
    //         ]
    //       })
    //     );
    //     this.submitted = false;
    //     this.addAnother = false;
    //   } else return;
    // } else
    {
      this.Address[this.t.length] = true;
      this.t.push(
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
      this.submitted = false;
      this.addAnother = false;
    }
  }

  checkSection(i) {
    console.log(i);
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
          this.sectionerrors = (i==1) ? i : "";
        }        
      }


    });
    if(i == 1){
      // console.log(this.dynamicForm.controls.launchdate.value<this.launchdate.toISOString().substr(0, 10));
      var ed = new Date(this.dynamicForm.controls.enddate.value + "Z");
      var dd = new Date(this.dynamicForm.controls.deliverdate.value + "Z");
      const diffTime = Math.abs(dd.getTime() - ed.getTime());
      this.diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      console.log("Ship time date must be less than ", this.diffDays);


      if(this.dynamicForm.controls.empcount.value=="less than 10"){
        this.eligible=false;
      }
      else if(this.dynamicForm.controls.budget.value=="less than $5"){
        this.eligible=false;
      } 
      
      if(this.dynamicForm.controls.budget.value=="$10+" || this.dynamicForm.controls.budget.value=="$15+"){
        this.fetchCatData(956);
        // this.updateimagesagain(this.myData);
      }
      else if(this.dynamicForm.controls.budget.value=="$20+" || this.dynamicForm.controls.budget.value=="$25+"){
        this.fetchCatData(957);
        // this.updateimagesagain(this.myData2);
      }
      // console.log(this.dynamicForm.controls.launchdate.value,"here",this.launchdate.toISOString().substr(0, 10))
      if(this.dynamicForm.controls.launchdate.value<this.launchdate.toISOString().substr(0, 10)){
        check=1;        
      }
      else if(this.dynamicForm.controls.enddate.value<this.enddate.toISOString().substr(0, 10)){
        check=1;        
      }
      else if(this.dynamicForm.controls.deliverdate.value<this.deliverdate.toISOString().substr(0, 10)){
        check=1;        
      }
    }
    if(i==4){
      if(this.sites.includes(this.dynamicForm.controls.storeurl.value)){
        console.log("here")
        check = 1;        
        this.urlError=true;
      }
    }
    if(i=="gift"){
      if(this.selection.length==0){
        check = 1; 
        alert("Select Products first");
      }
    }
    if (check == 0) {
      // console.log(this.stepper)
      this.stepper.next();
    } else return;
  }

  addSingleAd(i) {
    // console.log(this.dynamicForm.controls);
    this.section4errors = true;
    if (this.dynamicForm.controls.addressesarray.invalid) {
      return;
    }    
    this.Address[i] = false;
    console.log(this.dynamicForm.value["addressesarray"][i]);
    this.addAnother = true;
    localStorage.setItem("adt", JSON.stringify(this.dynamicForm.value));    
    this.section4errors = false;
  }

  CancelSingleAd(i) {
    this.t.removeAt(i);
    this.addAnother = true;
  }

  EditSingleAd(i) {
    this.Address[i] = true;
    for (var x = 0; x <= this.t.length; x++) {
      if (this.Address[x] && x != i) {
        this.CancelSingleAd(x);
      }
    }
  }

  isArray(obj: any) {
    return Array.isArray(obj);
  }

  checkUrl(storename){

  }


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