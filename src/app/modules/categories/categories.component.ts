import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MatChipInputEvent } from '@angular/material/chips';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { handleError } from '../shared/helpers/error-handler';
import { AccountService } from '../shared/services/account.service';
import { ComponentService } from '../shared/services/component.service';
import { VendorService } from '../shared/services/vendor.service';
import { stringify } from 'querystring';

export interface Fruit {
  name: string;
}
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  form: FormGroup;
  submitted: boolean;
  subCategories: any[];
  categories: any[];
  imageUrl: any;
  isVendor: boolean;
  selectedFile: ImageSnippet;
  units: string[];
  fileInfo: string;
  fileToUpload: any;
  foodSubCategories: string[];
  sugarSubCategories: string[];
  category: any
  subcategory: string[];
  catsucat: any

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
      customization: this.fb.array([]),
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
    this.accountService.getcategory().subscribe(
      (data) => {
        this.catsucat = data
        console.log("catsucat", data)
      }
    )
  }







  // To create a new product
  submitForm(subcategory, category) {
    console.log("from cosole category", subcategory)
    this.subcategory = subcategory
    this.category = category
    console.log("from cosole subcategory", (subcategory.split(',')))
    console.log("from cosole subcategory", typeof (subcategory))
    console.log("from cosole category", category)
    let subcategoryarr = subcategory.split(',');
    let g = subcategoryarr[0].split(',')
    console.log("g", g);


    this.accountService.createcategory(subcategory, category).subscribe(

      (result) => {
        console.log("result")
        this.toasterService.success('Category added successfully', 'Success');
        console.log("result", result)
        this.accountService.getcategory().subscribe(
          (data) => {
            this.catsucat = data
            console.log("catsucat", data)
          }
        )
      },
      (err) => {
        console.log("err")
        console.log("err", err)
        if (err.status === 200) {
          this.toasterService.success(
            'Product added successfully',
            'Success'
          );


        } else {
          this.toasterService.error(handleError(err), 'Error');
        }
      }
    )
  }

  addmore() {
    this.subcategory = []
    this.category = ""
    console.log("from cosole subcategory", this.subcategory)
    console.log("from cosole category", this.category)
  }
  // To reset the form


  // To do bulk product upload


  // To handle file selection


  // To handle subcategory updation upon selecting category







}
