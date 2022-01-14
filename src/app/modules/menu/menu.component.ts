import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VendorService } from '../shared/services/vendor.service';
import { ComponentService } from '../shared/services/component.service';

export interface Menu {
  id: number;
  imgUrl: string;
  price: string;
  description: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  menus: Menu[];

  constructor(
    private componentService: ComponentService,
    private vendorService: VendorService,
    private router: Router
  ) {
    this.menus = [];
  }

  ngOnInit(): void {
    this.componentService.updateComponent('menu');
    this.getVendorMenuItems();
  }

  navigateToDetails(id: any) {
    //this.router.navigate(['/', 'vendor', 'product', id]);
    this.router.navigate(['/', 'vendor', 'product', id]);
  }

  getVendorMenuItems() {
    this.vendorService.getVendorItems().subscribe((response: any) => {
      for (let item of response) {
        let currItem: Menu = {
          id: item.itemId,
          imgUrl: item.imagePath,
          price: item.price,
          description: item.itemname,
        };
        this.menus.push(currItem);
      }
    });
  }
}
