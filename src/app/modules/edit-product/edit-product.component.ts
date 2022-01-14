import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';
import { handleError } from '../shared/helpers/error-handler';
import { AccountService } from '../shared/services/account.service';
import { ComponentService } from '../shared/services/component.service';
import { VendorService } from '../shared/services/vendor.service';
import { Location } from '@angular/common';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  form: FormGroup;
  submitted: boolean;
  subCategories: any[];
  categories: any[];
  imageUrl: any;
  productId: any;
  selectedFile: ImageSnippet;
  units: string[];
  foodSubCategories: string[];
  sugarSubCategories: string[];

  constructor(
    private componentService: ComponentService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private vendorService: VendorService,
    private accountService: AccountService,
    private toasterService: ToastrService,
    private router: Router,
    private _location: Location
  ) {
    this.form = this.fb.group({
      itemname: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      ingredients: ['', [Validators.required]],
      isVeg: ['', [Validators.required]],
      category: ['', [Validators.required]],
      subCategory: ['', [Validators.required]],
      price: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      image: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    });
    this.subCategories = [
      'Breakfast',
      'Beverages',
      'North Indian',
      'South Indian',
      'Continental',
      'Desserts',
      'Oriental',
      'Platter',
      'Healthy',
      'Snacks',
      'Regional',
    ];
    this.categories = [
      'Food',
      'Sugar & Spices',
      'Home Decor',
      'Fashion',
      'Plants & Planters',
    ];
    this.imageUrl = 'assets/images/img-placeholder.png';
    this.productId = '';
    this.units = ['gm', 'kg', 'plate', 'ml', 'pcs', 'inches'];
    this.foodSubCategories = [
      'Breakfast',
      'Beverages',
      'North Indian',
      'South Indian',
      'Continental',
      'Desserts',
      'Oriental',
      'Platter',
      'Healthy',
      'Snacks',
      'Regional',
    ];

    this.sugarSubCategories = [
      'Bakery Items',
      'Chocolates ',
      'Savories',
      'Jams & Spreads',
      'Spices & Pickles',
    ];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id');
      this.getItemDetail(this.productId);
      this.getSubCategory(this.productId);
    });
  }

  uploadFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.imageUrl = this.selectedFile.src.toString();
      this.form.patchValue({
        image: this.selectedFile.file,
      });
    });

    reader.readAsDataURL(file);
  }

  submitForm() {
    //console.log(this.form);
    if (this.form.invalid) {
      this.toasterService.info(
        'Please enter all the required details',
        'Message!'
      );
    } else {
      if (!this.form.value.image) {
        this.toasterService.info('Please upload the image', 'Message!');
        return;
      }

      let vendorId = this.accountService.getUserId();
      const payload = this.form.value;
      payload['vendorId'] = vendorId;
      payload['itemId'] = this.productId;

      this.vendorService.updateItem(payload).subscribe(
        (result) => {
          this.toasterService.success('Product added successfully', 'Success');
          this.form.reset();
          this.imageUrl = 'assets/images/img-placeholder.png';
          this.router.navigate(['/', 'vendor-menu']);
        },
        (err) => {
          if (err.status === 200) {
            this.toasterService.success(
              'Product added successfully',
              'Success'
            );
            this.form.reset();
            this.imageUrl = 'assets/images/img-placeholder.png';
            this.router.navigate(['/', 'vendor-menu']);
          } else {
            this.toasterService.error(handleError(err), 'Error');
          }
        }
      );
    }
  }

  getItemDetail(id) {
    this.vendorService.getItemByID(id).subscribe(
      (result: any) => {
        if (result) {
          this.imageUrl = result.imagePath;
          this.form.patchValue({
            image: result.imagePath,
            price: result.price,
            unit: result.unit,
            category: result.category,
            ingredients: result.ingredients,
            itemname: result.itemname,
            desc: result.desc,
            quantity: 'quantity' in result ? result.quantity : '',
            isVeg: result.isVeg,
          });
        }
      },
      (err) => {
        this.toasterService.error(handleError(err));
      }
    );
  }

  getSubCategory(id) {
    this.vendorService.getItemSubCategoryByID(id).subscribe(
      (result: any) => {
        if (result && 'rows' in result && result.rows) {
          this.form.patchValue({
            subCategory: result.rows.map(
              (category) => category.subcategoryName
            ),
          });
        }
      },
      (err) => {
        this.toasterService.error(handleError(err));
      }
    );
  }

  // To go back to previous page
  goBack() {
    this._location.back();
  }

  // To handle subcategory updation upon selecting category
  onCategorySelection() {
    if (this.form.value.category === 'Food') {
      this.subCategories = [...this.foodSubCategories];
    } else if (this.form.value.category === 'Sugar & Spices') {
      this.subCategories = [...this.sugarSubCategories];
    } else {
      this.subCategories = [...this.foodSubCategories];
    }
  }
}
