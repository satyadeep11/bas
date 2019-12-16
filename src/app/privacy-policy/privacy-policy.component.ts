import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser'; 

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(private titleService: Title,private meta: Meta) {
    meta.updateTag({name: 'description', content: 'Read the Privacy Policy for Build-A-Gift Store here.'});
    this.setTitle( 'Privacy Policy | Build-A-Gift Store' );
   }

   public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }
  
  ngOnInit() {
  }

  redirect(id){
    document.querySelector('#'+id).scrollIntoView();
  }
}
