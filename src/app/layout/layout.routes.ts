import { Routes } from '@angular/router';
import { Layout } from './layout';

export const layoutRoutes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            {
                path: '',
                loadComponent: () => import('../features/home/home-page').then((p) => p.HomePage)
            },
            {
                path: 'catalog',
                loadComponent: () => import('../features/vehicle-catalog/catalog-page').then((p) => p.CatalogPage)
            },
            {
                path: 'quotation',
                loadComponent: () => import('../features/quotation/quotation-page').then((p) => p.QuotationPage)
            },
            

        ]
    }
];
