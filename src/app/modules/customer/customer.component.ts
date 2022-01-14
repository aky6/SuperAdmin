import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms'
import { ComponentService } from '../shared/services/component.service';
import { AdminService } from '../shared/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { handleError } from '../shared/helpers/error-handler';

export interface user{
  userId : string,
  name : string,
  email : string,
  mobilenumber : number,
  imagePath : string,
  IsSelected : boolean,
  createdDt : Date
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})

export class CustomerComponent implements OnInit {
  currPage : number;
  totUsers : number;
  userList : user[];
  searchForm : FormGroup;

  constructor(private router : Router,
    private componentService: ComponentService,
    private adminService : AdminService,
    private toasterService: ToastrService,
    private formBuilder : FormBuilder) {
    this.currPage = 1;
    this.totUsers =0;
    this.userList = [];
    this.searchForm = formBuilder.group({
      searchName : ['']
    });
    this.loadUserGrid();
  }

  ngOnInit(): void {
    this.componentService.updateComponent('customer');
  }

  loadPrevPage()
  {
    if(this.currPage > 1)
    {
      this.currPage = this.currPage - 1;
      this. loadUserGrid();
    }
    return false;
  }

  loadNextPage()
  {
    if(this.currPage < Math.ceil(this.totUsers/5))
    {
      this.currPage = this.currPage + 1;
      this. loadUserGrid();
    }
    return false;
  }

  loadUserGrid()
  {
    this.adminService.getUserListForAdmin().subscribe(
      (resp:any)=>{
        this.userList = [];
        for(let user of resp)
        {
          let currItem : user ={
            userId : user.userId,
            name : user.firstname,
            email : user.email_Id,
            mobilenumber : user.mobileNumber,
            IsSelected : false,
            imagePath : user.imagePath,
            createdDt : user.created_at
          };
          this.userList.push(currItem);
        }
      },
      (err : any) =>{
        this.toasterService.error(handleError(err));
      }
    );
  }

  showDetails(userId : string)
  {
    this.router.navigateByUrl(`/customer/detail/${userId}`);
  }

  searchUser()
  {
    let searchKeyword = this.searchForm.controls.searchName.value;
    if(searchKeyword)
    {
      this.adminService.getCustomerDetailsByName(searchKeyword).subscribe((resp:any)=>{
        this.userList = [];
        if (resp) {
          for (let user of resp) {
            let currItem: user = {
              userId: user.userId,
              name: user.firstname,
              email: user.email_Id,
              IsSelected : false,
              mobilenumber: user.mobileNumber,
              imagePath: user.imagePath,
              createdDt: user.created_at
            };
            this.userList.push(currItem);
          }
        }
      },(err : any)=>{
        handleError(err);
      })
    }
  }

  deleteSelectedUsers()
  {
    let userIds = this.userList.filter((ele)=>ele.IsSelected == true).map((ele)=>ele.userId);
    console.log(userIds);
    if(userIds.length > 0)
    {
      this.adminService.deleteUsers(userIds).subscribe((resp:any)=>{
        this.loadUserGrid();
        this.toasterService.success('users are deleted','success');
      },
      (err:any)=>{
        handleError(err);
      });
    }
  }
}
