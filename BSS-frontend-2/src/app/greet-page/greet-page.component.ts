import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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

  localStorage.removeItem("batteryState2")
  this.timeOutId = setTimeout(() => {
    this.router.navigate(['/']);
  }, 4000); 
  }

  ngOnDestroy(){
    clearTimeout(this.timeOutId);
  }

}
