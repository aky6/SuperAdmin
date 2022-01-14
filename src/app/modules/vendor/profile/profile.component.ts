import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ignoreElements } from 'rxjs/operators';
import { handleError } from '../../shared/helpers/error-handler';
import { User } from '../../shared/models/user';
import { AccountService } from '../../shared/services/account.service';
import { ComponentService } from '../../shared/services/component.service';
import { VendorService } from '../../shared/services/vendor.service';
import { AdminService } from '../../shared/services/admin.service';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

export interface Menu {
  id: number;
  itemname: string;
  imgUrl: string;
  price: string;
  description: string;
}

export interface Profile {
  name: string;
  role: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  description: string;
}

export interface MenuPage
{
  currPageNo : number,
  TotalItems : number,
  itemsPerPage : number
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  displayMenu: boolean;
  displayAbout: boolean;
  displayHistory: boolean;
  profile: any;
  menus: Menu[];
  vendorId: string;
  form: FormGroup;
  isVendor : boolean;
  user: User;
  vendorImgUrl: string;
  selectedFile: ImageSnippet;
  menuPageDetail : MenuPage

  @ViewChild('closeModal') closeModal: ElementRef;

  constructor(
    private componentService: ComponentService,
    private router: Router,
    private vendorService: VendorService,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private toasterService: ToastrService,
    private fb: FormBuilder,
    private adminService : AdminService
  ) {
    this.displayMenu = false;
    this.displayAbout = true;
    this.isVendor = false;

    this.menus = [];
    this.vendorId = '';

    this.form = this.fb.group({
      firstname: ['', []],
      mobileNumber: ['', []],
      email: ['', []],
      user_desc: ['', []],
      Address: ['', []],
      city: ['', []],
      image: ['', []],
      zip: [''],
      state: [''],
    });

    this.menuPageDetail = {
      currPageNo : 1,
      TotalItems : 0,
      itemsPerPage : 12
    };

    this.vendorImgUrl = 'assets/images/img-placeholder.png';
  }

  ngOnInit(): void {
    this.componentService.updateComponent('vendor');
    this.accountService.user.subscribe((x) => {
      this.user = x;
      if (this.user && this.user.user.roles === 'vendor') {
        this.isVendor = false;
      }
    });
    if(!this.isVendor)
    {
      this.vendorId = this.route.snapshot.paramMap.get('id');
    }
    else
    {
      this.vendorId = this.accountService.getUserId();
    }
    if (this.vendorId) {
      this.getAdminById();
    }
  }

  toggleMenu() {
    this.displayMenu = true;
    this.displayAbout = false;
    this.getVendorMenuItems();
  }

  toggleAbout() {
    this.displayMenu = false;
    this.displayAbout = true;
  }

  navigateToDetails(id: any) {
    this.router.navigate(['/', 'vendor', 'product', id]);
  }

  loadPrevPage()
  {
    if(this.menuPageDetail.currPageNo > 1)
    {
      this.menuPageDetail.currPageNo -= 1;
      this.getVendorMenuItems();
    }
    return false;
  }

  loadNextPage()
  {
    if(this.menuPageDetail.currPageNo < Math.ceil(this.menuPageDetail.TotalItems/this.menuPageDetail.itemsPerPage))
    {
      this.menuPageDetail.currPageNo += 1;
      this.getVendorMenuItems();
    }
    return false;
  }

  getVendorMenuItems() {
    this.menus = [];
    if(this.isVendor)
    {
      this.vendorService.getVendorItems().subscribe((response: any) => {
        for (let item of response) {
          let currItem: Menu = {
            id: item.itemId,
            itemname: item.itemname,
            imgUrl: item.imagePath,
            price: item.price,
            description: item.itemname,
          };
          this.menus.push(currItem);
        }
      });
    }
    else
    {
      this.vendorService.getVendorItemsForAdmin(this.vendorId, this.menuPageDetail.currPageNo).subscribe((response: any) => {
        this.menuPageDetail.TotalItems = response.count;
        this.menus = [];
        for (let item of response.rows) {
          let currItem: Menu = {
            id: item.itemId,
            itemname: item.itemname,
            imgUrl: item.imagePath,
            price: item.price,
            description: item.itemname,
          };
          this.menus.push(currItem);
        }
      });
    }

  }

  getVendorById() {
    this.vendorService.getVendorByID(this.vendorId).subscribe(
      (result) => {
        //console.log(result);
        this.profile = result;
      },
      (err) => {
        if (err.status !== 200) {
          this.toasterService.error(handleError(err));
        }
      }
    );
  }

  getAdminById() {
    this.adminService.getAdminByID(this.vendorId).subscribe(
      (result) => {
        //console.log(result);
        this.profile = result;
      },
      (err) => {
        if (err.status !== 200) {
          this.toasterService.error(handleError(err));
        }
      }
    );
  }
  // To edit the vendor
  editVendor() {
    this.form.reset();
    this.vendorService.getVendorByID(this.vendorId).subscribe(
      (result) => {
        this.profile = result;

        if (this.profile) {
          this.form.patchValue({
            image: this.profile.imagePath,
            firstname: this.profile.firstname,
            email: this.profile.email_Id,
            user_desc: this.profile.user_desc,
            Address: this.profile.Address,
            city: this.profile.city,
            mobileNumber: this.profile.mobileNumber,
            zip: this.profile.zip,
            state: this.profile.state,
          });

          this.vendorImgUrl = this.profile.imagePath;
        }
      },
      (err) => {
        if (err.status !== 200) {
          this.toasterService.error(handleError(err));
        }
      }
    );
  }

  uploadFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.vendorImgUrl = this.selectedFile.src.toString();
      this.form.patchValue({
        image: this.selectedFile.file,
      });
    });

    reader.readAsDataURL(file);
  }

  // To update the vendor profile image
  updateProfile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
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
        image: this.selectedFile.file,
        vendorId: vendorId,
      };

      this.vendorService.updateVendorProfileImage(payload).subscribe(
        (result) => {
          this.toasterService.success(
            'Profile updated successfully',
            'Success'
          );
          this.form.reset();
          this.vendorImgUrl = 'assets/images/img-placeholder.png';
          this.getVendorById();
        },
        (err) => {
          if (err.status === 200) {
            this.toasterService.success(
              'Profile updated successfully',
              'Success'
            );
            this.vendorImgUrl = 'assets/images/img-placeholder.png';
            this.getVendorById();
          } else {
            this.toasterService.error(handleError(err), 'Error');
          }
        }
      );
    });

    reader.readAsDataURL(file);
  }

  updateVendor() {
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
    let key: any;
    let value: any;

    for ([key, value] of Object.entries(payload)) {
      if (key === 'image') {
        if (typeof value === 'string') {
          delete payload[key];
        }
      } else {
        if (!value) {
          payload[key] = '';
        }
      }
    }

    this.vendorService.updateVendor(payload).subscribe(
      (result) => {
        this.toasterService.success('Updated successfully', 'Success');
        this.form.reset();
        this.vendorImgUrl = 'assets/images/img-placeholder.png';
        this.getVendorById();
        this.closeModal.nativeElement.click();
      },
      (err) => {
        if (err.status === 200) {
          this.toasterService.success('Updated successfully', 'Success');
          this.form.reset();
          this.vendorImgUrl = 'assets/images/img-placeholder.png';
          this.getVendorById();
          this.closeModal.nativeElement.click();
        } else {
          this.toasterService.error(handleError(err), 'Error');
        }
      }
    );
  }

}
