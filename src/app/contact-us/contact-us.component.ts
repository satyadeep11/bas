import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser'; 

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  contactForm:FormGroup;
  submitted=false;


  constructor(private formBuilder: FormBuilder,private titleService: Title,private meta: Meta) {
    meta.updateTag({name: 'description', content: 'Connect with the Build-A-Gift Store team via email or phone here. We promise to respond within one business day.'});
    this.setTitle( 'Contact Us | Build-A-Gift Store' );
    this.contactForm = this.formBuilder.group({
      fname: ["", Validators.required],
      lname: ["", Validators.required],
      phone: [""],
      email: ["", Validators.required],
      cname: [""],
      msg: [""],
    });
   }   

   public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  ngOnInit() {
  }

  send(){
    this.submitted=true;
    if (this.contactForm.invalid) {
      return;
    }    
    console.log(this.contactForm.value);
  }

}
