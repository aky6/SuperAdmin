import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http : HttpClient) { }

  getTotalRevenue()
  {
    return this.http.get(`${environment.apiUrl}/totalrevenue`);
  }

  getTotalCustomers()
  {
    return this.http.get(`${environment.apiUrl}/totalcustomers`);
  }

  getTotalVendors()
  {
    return this.http.get(`${environment.apiUrl}/totalvendors`);
  }

  getTotalOrders()
  {
    return this.http.get(`${environment.apiUrl}/totalorders`);
  }

  getBestSellingProducts()
  {
    return this.http.get(`${environment.apiUrl}/bestseller`);
  }

  getRecentOrders()
  {
    return this.http.get(`${environment.apiUrl}/recentorderapi`);
  }
}
