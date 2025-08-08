import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LayoutComponent } from './frontend/layout/layout.component';
import { AdminlayoutComponent } from './admin/adminlayout/adminlayout.component';
import { AdminGuard } from './core/guards/admin.guard';
import { UserGuard } from './core/guards/user.guard';

export const routes: Routes = [
  {

    path: '',
    component: LayoutComponent,
    children: [

      {
        path: '',
        loadComponent: () =>
          import('./frontend/pages/home/home.component').then(m => m.HomeComponent),
      },

      {
        path: 'oauth-callback', loadComponent: () =>
          import('./auth/components/oauth-callback/oauth-callback.component').then(m => m.OauthCallbackComponent),
      },

      {
        path: 'sign-up',
        loadComponent: () =>
          import('./auth/components/sign-up/sign-up.component').then(m => m.SignUpComponent),
      },


      {
        path: 'verify-email',
        loadComponent: () =>
          import('./auth/components/verify-email/verify-email.component').then(m => m.VerifyEmailComponent),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/components/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./frontend/component/user-about/user-about.component').then(m => m.UserAboutComponent)
      },

      {
        path: 'contact-us',
        loadComponent: () => import('./frontend/component/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'forget-password',
        loadComponent: () =>
          import('./auth/components/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./auth/components/rest-password/rest-password.component').then(m => m.RestPasswordComponent),
      },

      {
        path: 'profile',
        canActivate: [UserGuard],

        loadComponent: () =>
          import('./frontend/component/profile/profile.component').then(m => m.ProfileComponent),
      },

    
     


      {
        path: 'collections',
        loadComponent: () =>
          import('./frontend/component/collection/collection.component').then(m => m.CollectionComponent),
      },

      // {
      //   path: 'collection/:id',
      //   loadComponent: () =>
      //     import('./frontend/component/collection-detail/collection-detail.component').then(m => m.CollectionDetailComponent),
      // },


      {
        path: 'products',
        loadComponent: () =>
          import('./frontend/component/product-list/product-list.component').then(m => m.ProductListComponent),
      },



      

      {
        path: 'testimonials',
        loadComponent: () =>
          import('./frontend/component/review/review.component').then(m => m.ReviewComponent),
      },
      {
        path: 'logout',
        loadComponent: () => import('./auth/components/logout/logout.component').then(m => m.LogoutComponent)
      },

      {
        path: 'cart',
        loadComponent: () =>
          import('./frontend/component/cart/cart.component').then(m => m.CartComponent),
      },

      {
        path: 'orders',
        canActivate: [UserGuard],

        loadComponent: () => import('./frontend/component/orders/orders.component').then(m => m.OrdersComponent)
      }




    ],
  },





  {
    path: 'admin',
    component: AdminlayoutComponent,
    canActivate: [AdminGuard],


    children: [

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/components/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },

    {
        path: 'profile',
        loadComponent: () =>
          import('./admin/components/profile/profile.component').then(m => m.ProfileComponent),
      },

      {
        path: 'contact',
        loadComponent: () =>
          import('./admin/components/admin-contact/admin-contact.component').then(m => m.AdminContactComponent),
      },


      // {
      //   path: 'brand',
      //   loadComponent: () =>
      //     import('./admin/components/brand/brand.component').then(m => m.BrandComponent),
      // },
      {
        path: 'customers',
        loadComponent: () =>
          import('./admin/components/handle-profile-by-admin/handle-profile-by-admin.component').then(m => m.HandleProfileByAdminComponent),
      },
      {
        path: 'category',
        loadComponent: () =>
          import('./admin/components/admin-category/admin-category.component').then(m => m.AdminCategoryComponent),
      },
      {
        path: 'collections',
        loadComponent: () =>
          import('./admin/components/admin-collection/admin-collection.component').then(m => m.AdminCollectionComponent),
      },

      {
        path: 'subcategory',
        loadComponent: () =>
          import('./admin/components/admin-sub-category/admin-sub-category.component').then(m => m.AdminSubCategoryComponent),
      },

      {
        path: 'products',
        loadComponent: () =>
          import('./admin/components/admin-product/admin-product.component').then(m => m.AdminProductComponent),
      },


      {
        path: 'testimonials',
        loadComponent: () => import('./admin/components/admin-testimonials/admin-testimonials.component').then(m => m.AdminTestimonialsComponent)
      },

      {
        path: 'orders',
        loadComponent: () => import('./admin/components/admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent)
      },
      {
        path: 'orders/:id',
        loadComponent: () => import('./admin/components/admin-order-detail/admin-order-detail.component').then(m => m.AdminOrderDetailComponent)
      },

      {
        path: 'about',
        loadComponent: () => import('./admin/components/admin-about/admin-about.component').then(m => m.AdminAboutComponent)
      },


    ]
  }
];
