// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { UserBrandService } from '../../../core/services/user-brand.service';
// import { Brand } from '../../../core/models/collections .model';

// @Component({
//   selector: 'app-brand-detail',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './brand-detail.component.html'
// })
// export class BrandDetailComponent implements OnInit {
//   brand?: Brand;
//   loading = true;
//   error = '';

//   constructor(private route: ActivatedRoute, private brandService: UserBrandService) { }

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) {
//       this.brandService.getBrandById(id).subscribe({
//         next: (res) => {
//           this.brand = res.brand;
//           this.loading = false;
//         },
//         error: (err) => {
//           this.error = 'Failed to load brand details';
//           this.loading = false;
//         }
//       });
//     }
//   }
// }
