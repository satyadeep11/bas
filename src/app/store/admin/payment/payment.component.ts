import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from "../../../../app/api.service";
import * as dropin from 'braintree-web-drop-in';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  @Input() storeid;
  @Output() paymentchange= new EventEmitter<boolean>();  
  token;
  customerid;
  loading=true;

  constructor(private apiService: ApiService) {
    
   }

  ngOnInit() {
    // var dropin = require('braintree-web-drop-in');
    this.braintreewidget();
  }

  braintreewidget(){
    var button = document.querySelector('#submit-button');    
    // button.setAttribute("hidden","true");
    this.apiService.get_customer_id(this.storeid).subscribe(
      user => {
        console.log(user);  
        if(user["error"]){  
          var dropinInstance;
          this.apiService.get_token().subscribe(
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
                dropinInstance = instance;
                if (createErr) {
                  // An error in the create call is likely due to
                  // incorrect configuration values or network issues.
                  // An appropriate error will be shown in the UI.
                  console.error(createErr);
                  return;
                }
                this.loading=false;
                button.removeAttribute("hidden");
                button.addEventListener('click',  ()=> {
                  instance.requestPaymentMethod((requestPaymentMethodErr, payload)=>{
                    console.log(payload);
                    var finaldata=({nonce:payload.nonce,storeid:this.storeid,userdata:{fname:JSON.parse(sessionStorage.getItem("ud"))["Firstname"],lname:JSON.parse(sessionStorage.getItem("ud"))["Lastname"],email:JSON.parse(sessionStorage.getItem("ud"))["Username"],phone:JSON.parse(sessionStorage.getItem("ud"))["Phone"]}});
                          
                    this.apiService.vault(finaldata).subscribe(
                      user => {
                        console.log(user);  
                        // button.setAttribute("hidden","true");
                        if(user.error!=false){
                          alert("There was a error adding this credit card to file. Please try again or try another credit card.");
                        }
                        else{
                          this.paymentchange.emit(true);
                        }

                            dropinInstance.teardown(function(err) {
                              if (err) { console.error('An error occurred during teardown:', err); }
                          });                          
                        this.braintreewidget();                        
                        },
                        error => console.log(error)
                      );
                    // Submit payload.nonce to your server
                    if (requestPaymentMethodErr) {
                      // No payment method is available.
                      // An appropriate error will be shown in the UI.
                      console.error(requestPaymentMethodErr);
                      return;
                    }          
                  });
                },{ once: true });
                var delete_btn = document.querySelector('[data-braintree-id="delete-confirmation__yes"]');
                console.log(delete_btn)
    delete_btn.addEventListener("click", function(){
      alert("deletion")
    });
              });
              },
              error => console.log(error)
            );

        }
        else{
          this.customerid=user["customerid"];
          this.apiService.customer_token(this.customerid).subscribe(
            token => {
              this.token=token;
              dropin.create({      
                authorization: this.token,
                container: '#dropin-container',
                vaultManager: true,
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
                this.loading=false;
                // button.setAttribute("hidden","true");
                button.addEventListener('click',  ()=> {
                  instance.requestPaymentMethod((requestPaymentMethodErr, payload)=>{
                    console.log(payload);
                    var finaldata=({nonce:payload.nonce,storeid:this.storeid,cid:this.customerid,userdata:{fname:JSON.parse(sessionStorage.getItem("ud"))["Firstname"],lname:JSON.parse(sessionStorage.getItem("ud"))["Lastname"],email:JSON.parse(sessionStorage.getItem("ud"))["Username"],phone:JSON.parse(sessionStorage.getItem("ud"))["Phone"]}});
                          
                    this.apiService.update_vault(finaldata).subscribe(
                      user => {
                        console.log(user);     
                        this.paymentchange.emit(true);           
                        },
                        error => console.log(error)
                      );
                    // Submit payload.nonce to your server
                    if (requestPaymentMethodErr) {
                      // No payment method is available.
                      // An appropriate error will be shown in the UI.
                      console.error(requestPaymentMethodErr);
                      return;
                    }          
                  });
                });

                var delete_btn = document.querySelector('[data-braintree-id="delete-confirmation__yes"]');
                var self=this;
                  delete_btn.addEventListener("click", function(){                    
                    var finaldata=({nonce:"ok",storeid:self.storeid,cid:self.customerid,userdata:{fname:JSON.parse(sessionStorage.getItem("ud"))["Firstname"],lname:JSON.parse(sessionStorage.getItem("ud"))["Lastname"],email:JSON.parse(sessionStorage.getItem("ud"))["Username"],phone:JSON.parse(sessionStorage.getItem("ud"))["Phone"]}});
                    self.apiService.delete_vault(finaldata).subscribe(
                      user => {
                        console.log(user);    
                        self.paymentchange.emit(false);          
                        },
                        error => console.log(error)
                      );
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
