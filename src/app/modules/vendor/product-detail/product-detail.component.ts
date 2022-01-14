import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../shared/services/vendor.service';
declare var $: any;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  productId: string;
  product: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private vendorService: VendorService
  ) {
    this.productId = '';
    this.product = {};
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id');
      this.getItemDetail(this.productId);
    });
  }

  navigateToEdit() {
    this.router.navigate(['/', 'edit-product', this.productId]);
  }

  getItemDetail(id) {
    this.vendorService.getItemByID(id).subscribe(
      (result) => {
        this.product = result;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
