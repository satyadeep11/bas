import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser'; 

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  constructor(private titleService: Title,private meta: Meta ) {
    meta.updateTag({name: 'description', content: 'Find answers to frequently asked questions related to how Build-A-Gift Store works and how you can make corporate gift giving so much easier. Start reading now!'});
    this.setTitle( 'FAQ | Build-A-Gift Store' );
   }

   public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  ngOnInit() {
  }

}
