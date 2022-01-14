import { Component, OnInit } from '@angular/core';
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
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss'],
})
export class VendorDashboardComponent implements OnInit {
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

  constructor(private componentService: ComponentService) {}

  ngOnInit(): void {
    this.componentService.updateComponent('dashboard');
  }
}
