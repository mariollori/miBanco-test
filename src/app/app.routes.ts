import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadChildren: ()=>  import('./layout/layout.routes').then((p)=> p.layoutRoutes)
    },
    {
        path:'**',
        redirectTo:''
    }
];
