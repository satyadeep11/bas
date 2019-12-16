import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser'; 

@Component({
  selector: 'app-tos',
  templateUrl: './tos.component.html',
  styleUrls: ['./tos.component.scss']
})
export class TosComponent implements OnInit {

  constructor(private titleService: Title,private meta: Meta) { 
    meta.updateTag({name: 'description', content: 'View Build-A-Gift Store`s Terms of Use policy here.'});
    this.setTitle( 'Terms of Use | Build-A-Gift Store' );
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  ngOnInit() {
  }

}
