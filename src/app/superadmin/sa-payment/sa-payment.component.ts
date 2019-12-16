import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from "../../../app/api.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dropin from 'braintree-web-drop-in';

@Component({
  selector: 'app-sa-payment',
  templateUrl: './sa-payment.component.html',
  styleUrls: ['./sa-payment.component.scss']
})
export class SaPaymentComponent implements OnInit {

  token;
  @Input() storeid;
  customerid;
  paymentid;
  paymentForm: FormGroup;
  submitted =false;
  transactiondetails;

  constructor(private formBuilder: FormBuilder,private apiService: ApiService) { }

  get f() { return this.paymentForm.controls; }

  ngOnInit() {
    this.paymentForm = this.formBuilder.group({
      amount: [0, Validators.required]      
  });

  this.braintreewidget();
  }

  braintreewidget(){
    this.apiService.get_customer_id(this.storeid).subscribe(
      user => {
        console.log(user);  
        if(user["error"]){         
          alert("No payment method available");          
        }
        else if(user["transaction"]==1){
          this.transactiondetails=Array(user["transactiondetails"]);
          console.log(this.transactiondetails);
          document.querySelector('#submit-button').setAttribute("hidden","true");
          document.querySelector('#amountinput').setAttribute("hidden","true");
          
        }
        else{
          // var dropin = require('braintree-web-drop-in');
          var button = document.querySelector('#submit-button');
          this.customerid=user["customerid"];
          this.paymentid=user["paymentid"];
          this.apiService.customer_token(this.customerid).subscribe(
            token => {
              this.token=token;
              dropin.create({      
                authorization: this.token,
                container: '#dropin-container',
                // vaultManager: true,
                card: {
                  cardholderName: {
                    required: false
                    // to make cardholder name required
                    // required: true
                  }
                }
              },(createErr, instance)=> {
                if (createErr) {
                  // An error in the create call is likely due to
                  // incorrect configuration values or network issues.
                  // An appropriate error will be shown in the UI.
                  console.error(createErr);
                  return;
                }
                button.addEventListener('click',  ()=> {
                  instance.requestPaymentMethod((requestPaymentMethodErr, payload)=>{
                    console.log(payload);
                    this.submitted = true;

                    // stop here if form is invalid
                    if (this.paymentForm.invalid) {
                      console.log(this.paymentForm.invalid)
                        return;
                    }
                    else{
                    var finaldata=({nonce:payload.nonce,paymentid:this.paymentid,storeid:this.storeid,amount:this.f.amount.value,userdata:{fname:JSON.parse(sessionStorage.getItem("ud"))["Firstname"],lname:JSON.parse(sessionStorage.getItem("ud"))["Lastname"],email:JSON.parse(sessionStorage.getItem("ud"))["Username"],phone:JSON.parse(sessionStorage.getItem("ud"))["Phone"]}});
                          
                    this.apiService.payment(finaldata).subscribe(
                      user => {
                        console.log(user);    
                        this.braintreewidget();          
                        },
                        error => console.log(error)
                      );}
                    // Submit payload.nonce to your server
                    if (requestPaymentMethodErr) {
                      // No payment method is available.
                      // An appropriate error will be shown in the UI.
                      console.error(requestPaymentMethodErr);
                      return;
                    }          
                  });
                });
              });
              },
              error => console.log(error)
            );
        }            
        },
        error => console.log(error)
      );
  }

}
