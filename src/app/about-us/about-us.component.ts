import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser'; 

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor(private titleService: Title ,private meta: Meta) {
    meta.updateTag({name: 'description', content: 'Learn more about Build-A-Gift Store and its parent company Identity Works, Inc. here. We have been in business for more than 20 years!'});
    this.setTitle( 'About Us | Build-A-Gift Store' );
   }

   public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  ngOnInit() {
  }

}
