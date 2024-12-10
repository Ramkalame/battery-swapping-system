import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { GreetPageComponent } from './greet-page/greet-page.component';

export const routes: Routes = [
    {
        path:"",
        component:HomeComponent
    },
    {
        // path:"dashboard/:rfId",
        path:"dashboard",
        component:DashboardComponent
    },
    {
        path:"greet",
        component:GreetPageComponent
    }

];
