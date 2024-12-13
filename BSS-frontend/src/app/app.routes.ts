import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { GreetPageComponent } from './greet-page/greet-page.component';
import { CardSwipeMessageComponent } from './card-swipe-message/card-swipe-message.component';
import { BufferingComponent } from './buffering/buffering.component';
import { InsertingAnimationComponent } from './popups/inserting-animation/inserting-animation.component';

export const routes: Routes = [
    {
        path:"",
        component:HomeComponent
    },
    {
       
        path:"dashboard/:rfId",
        component:DashboardComponent
    },
    {
        path:"greet",
        component:GreetPageComponent
    },
    {path:"card-swaipe-message", component:CardSwipeMessageComponent},
    {path:"wait", component:BufferingComponent},
    {path:"insert", component:InsertingAnimationComponent},

];
