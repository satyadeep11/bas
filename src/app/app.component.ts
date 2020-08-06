import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from '@angular/router';


declare let gtag: Function;

@Component({ selector: "app-root", templateUrl: "app.component.html" })

export class AppComponent implements OnInit {
  constructor(private router: Router) {   
    
          this.router.events.subscribe(event => {
         if(event instanceof NavigationEnd){
             gtag('config', 'UA-173040459-1', 
                   {
                     'page_path': event.urlAfterRedirects
                   }
                  );
          }
       })


  }
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
  });
  }
}


