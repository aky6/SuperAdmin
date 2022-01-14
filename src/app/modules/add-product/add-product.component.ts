import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { handleError } from '../shared/helpers/error-handler';
import { AccountService } from '../shared/services/account.service';
import { ComponentService } from '../shared/services/component.service';
import { VendorService } from '../shared/services/vendor.service';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  form: FormGroup;
  submitted: boolean;
  subCategories: any[];
  categories: any[];
  imageUrl: any;
  isVendor : boolean;
  selectedFile: ImageSnippet;
  units: string[];
  fileInfo: string;
  fileToUpload: any;
  foodSubCategories: string[];
  sugarSubCategories: string[];

  constructor(
    private componentService: ComponentService,
    private fb: FormBuilder,
    private toasterService: ToastrService,
    private vendorService: VendorService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      itemname: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      ingredients: [''],
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
    this.units = ['gm', 'kg', 'plate', 'ml', 'pcs', 'inches'];
    this.fileInfo = '';
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
    this.isVendor = false;
    console.log(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.componentService.updateComponent('add-product');
    this.form.patchValue({
      category: 'Food',
    });
  }

  // Handle file upload
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

  onVegSelection() {
    this.form.patchValue({
      isVeg: 'Yes',
    });
  }

  onNonVegSelection() {
    this.form.patchValue({
      isVeg: 'No',
    });
  }

  // To create a new product
  submitForm() {
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
      let vendorId = '';
      if(this.isVendor)
      {
        vendorId = this.accountService.getUserId();
      }
      else
      {
        vendorId = this.route.snapshot.paramMap.get('id');
      }

      const payload = this.form.value;
      payload['vendorId'] = vendorId;

      this.vendorService.createItem(payload).subscribe(
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

  // To reset the form
  resetForm() {
    this.form.reset();
  }

  // To do bulk product upload
  uploadBulk() {
    let vendorId = '';
    if(this.isVendor)
    {
      vendorId = this.accountService.getUserId();
    }
    else
    {
      vendorId = this.route.snapshot.paramMap.get('id');
    }
    const payload = {
      file: this.fileToUpload,
      vendorId: vendorId
    };
    this.vendorService.uploadInBulk(payload).subscribe(
      (result) => {
        this.router.navigate(['/', 'vendor-menu']);
      },
      (err) => {
        if (err.status === 200) {
          this.router.navigate(['/', 'vendor-menu']);
        } else {
          this.toasterService.error(handleError(err));
        }
      }
    );
  }

  // To handle file selection
  onFileSelect(input: HTMLInputElement): void {
    function formatBytes(bytes: number): string {
      const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const factor = 1024;
      let index = 0;

      while (bytes >= factor) {
        bytes /= factor;
        index++;
      }

      return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
    }

    const file: File = input.files[0];
    this.fileToUpload = file;
    this.fileInfo = `${file.name} (${formatBytes(file.size)})`;
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
