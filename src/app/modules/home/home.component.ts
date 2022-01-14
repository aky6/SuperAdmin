import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend,
} from 'ng-apexcharts';
import { ComponentService } from '../shared/services/component.service';
import { AccountService } from '../shared/services/account.service'
import { DashboardService } from '../shared/services/dashboard.service'
import { handleError } from '../shared/helpers/error-handler';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  lineOption = {
    series: [
      {
        name: 'Series',
        data: [4, 3, 10, 9, 29, 19, 22],
      },
    ],
    chart: {
      height: 286,
      type: 'line',
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    grid: {
      show: true,
      borderColor: '#f5f5f5',
      strokeDashArray: 0,
      position: 'back',
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        right: 5,
        left: 5,
      },
    },
    colors: ['#09D1DE'],
    xaxis: {
      type: 'datetime',
      categories: [
        '1/11/2020',
        '2/11/2020',
        '3/11/2020',
        '4/11/2020',
        '5/11/2020',
        '6/11/2020',
        '7/11/2020',
      ],
    },
    markers: {
      size: 4,
      colors: ['#FFA41B'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    fill: {
      type: 'solid',
    },
    yaxis: {
      tickAmount: 4,
      min: 0,
      max: 30,
    },
  };

  lineOptionsTwo = {
    series: [
      {
        name: 'Sales',
        data: [400, 556, 350, 310, 209, 470, 1002, 508, 780, 690, 880, 652],
      },
    ],
    chart: {
      height: 311,
      type: 'line',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      dashArray: 3,
    },
    colors: ['#FFBA5A', '#8381FD'],
    grid: {
      borderColor: '#f5f5f5',
    },
    markers: {
      size: 7,
      colors: ['#67CF94'],
      hover: {
        size: 8,
      },
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yaxis: {
      tickAmount: 4,
    },
    responsive: [
      {
        breakpoint: 576,
        options: {
          markers: {
            size: 5,
            colors: ['#67CF94'],
            hover: {
              size: 5,
            },
          },
        },
      },
    ],
  };
  totalRevenue : number;
  totalCustomers : number;
  totalVendors : number;
  totalOrders : number;
  bestSellingData : any;
  recentOrderData : any;

  constructor(private componentService: ComponentService,
              private accountService : AccountService,
              private dashboardService : DashboardService) {
    this.accountService.setHeaderDisplayStatus(false);
  }

  ngOnInit(): void {
    this.componentService.updateComponent('dashboard');
    this.loadTotalRevenue();
    this.loadTotalCustomers();
    this.loadTotalVendors();
    this.loadTotalOrders();
    this.loadBestSelling();
    this.loadRecentOrders();
  }

  loadTotalRevenue()
  {
    this.dashboardService.getTotalRevenue().subscribe((resp : any)=>{
      this.totalRevenue = Number(resp[0].total);
    },
    (err:any)=>{
      handleError(err);
    })
  }

  loadTotalCustomers()
  {
    this.dashboardService.getTotalCustomers().subscribe((resp : any)=>{
      this.totalCustomers = Number(resp);
    },
    (err:any)=>{
      handleError(err);
    })
  }

  loadTotalVendors()
  {
    this.dashboardService.getTotalVendors().subscribe((resp : any)=>{
      this.totalVendors = Number(resp);
    },
    (err:any)=>{
      handleError(err);
    })
  }

  loadTotalOrders()
  {
    this.dashboardService.getTotalOrders().subscribe((resp : any)=>{
      this.totalOrders = Number(resp);
    },
    (err:any)=>{
      handleError(err);
    });
  }

  loadBestSelling()
  {
    this.dashboardService.getBestSellingProducts().subscribe((resp : any)=>{
      if(resp && resp.length)
      {
        this.bestSellingData = resp;
      }
    },
    (err:any)=>{
      handleError(err);
    });
  }

  loadRecentOrders()
  {
    this.dashboardService.getRecentOrders().subscribe((resp : any) =>{
      if(resp && resp.length)
      {
        this.recentOrderData = [];
        resp.forEach(element => {
          element.itemList = JSON.parse(element.itemList)
          this.recentOrderData.push(element);
        });;
      }
    });
  }
}
