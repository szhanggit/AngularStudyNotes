import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { SliderComponent } from './component/slider/slider.component';
import { ToastalertComponent } from './component/toastalert/toastalert.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'slider',component:SliderComponent},
    {path:'toast',component:ToastalertComponent}
];
