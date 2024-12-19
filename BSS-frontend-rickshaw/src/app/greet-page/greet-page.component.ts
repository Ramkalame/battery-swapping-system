import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-greet-page',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './greet-page.component.html',
  styleUrl: './greet-page.component.css'
})
export class GreetPageComponent implements OnInit {
  private timeOutId!:any;

  constructor(private router:Router){}

  ngOnInit(){
  // this.timeOutId = setTimeout(() => {
  //   this.router.navigate(['/']);
  // }, 3000); 
  }

  ngOnDestroy(){
    clearTimeout(this.timeOutId);
  }

}
