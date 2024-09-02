import React from 'react';
import Chart from 'react-apexcharts';

const MultipleAreaCharts = () => {
  const chartOptions = {
    chart: {
      height: 300,
      type: 'area',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    series: [
      {
        name: 'Income',
        data: [18000, 51000, 60000, 38000, 88000, 50000, 40000, 52000, 88000, 80000, 60000, 70000],
      },
      {
        name: 'Outcome',
        data: [27000, 38000, 60000, 77000, 40000, 50000, 49000, 29000, 42000, 27000, 42000, 50000],
      },
    ],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
      width: 2,
    },
    grid: {
      strokeDashArray: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shadeIntensity: 1,
        opacityFrom: 0.1,
        opacityTo: 0.8,
      },
    },
    xaxis: {
      type: 'category',
      tickPlacement: 'on',
      categories: [
        '25 January 2023',
        '26 January 2023',
        '27 January 2023',
        '28 January 2023',
        '29 January 2023',
        '30 January 2023',
        '31 January 2023',
        '1 February 2023',
        '2 February 2023',
        '3 February 2023',
        '4 February 2023',
        '5 February 2023',
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        stroke: {
          dashArray: 0,
        },
        dropShadow: {
          show: false,
        },
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        style: {
          colors: '#9ca3af',
          fontSize: '13px',
          fontFamily: 'Inter, ui-sans-serif',
          fontWeight: 400,
        },
        formatter: (title) => {
          let t = title;
          if (t) {
            const newT = t.split(' ');
            t = `${newT[0]} ${newT[1].slice(0, 3)}`;
          }
          return t;
        },
      },
    },
    yaxis: {
      labels: {
        align: 'left',
        minWidth: 0,
        maxWidth: 140,
        style: {
          colors: '#9ca3af',
          fontSize: '13px',
          fontFamily: 'Inter, ui-sans-serif',
          fontWeight: 400,
        },
        formatter: (value) => (value >= 1000 ? `${value / 1000}k` : value),
      },
    },
    tooltip: {
      x: {
        format: 'MMMM yyyy',
      },
      y: {
        formatter: (value) => `$${value >= 1000 ? `${value / 1000}k` : value}`,
      },
    },
    responsive: [
      {
        breakpoint: 568,
        options: {
          chart: {
            height: 300,
          },
          xaxis: {
            labels: {
              style: {
                colors: '#9ca3af',
                fontSize: '11px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400,
              },
              offsetX: -2,
              formatter: (title) => title.slice(0, 3),
            },
          },
          yaxis: {
            labels: {
              align: 'left',
              minWidth: 0,
              maxWidth: 140,
              style: {
                colors: '#9ca3af',
                fontSize: '11px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400,
              },
              formatter: (value) => (value >= 1000 ? `${value / 1000}k` : value),
            },
          },
        },
      },
    ],
    colors: ['#2563eb', '#9333ea'],
    fill: {
      gradient: {
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: '#e5e7eb',
    },
  };

  return (
    <div className="bg-gray-50 p-8 min-h-[300px] flex flex-col items-center justify-center font-sans text-gray-700">
        <h4>Public Notice Analysis Report</h4>
      <div className="flex justify-center sm:justify-end items-center gap-x-4 mb-6 pt-5">
        
        <div className="inline-flex items-center">
          <span className="w-2.5 h-2.5 inline-block bg-blue-600 rounded-sm mr-2"></span>
          <span className="text-sm text-gray-600 dark:text-neutral-400">Income</span>
        </div>
        <div className="inline-flex items-center">
          <span className="w-2.5 h-2.5 inline-block bg-purple-600 rounded-sm mr-2"></span>
          <span className="text-sm text-gray-600 dark:text-neutral-400">Outcome</span>
        </div>
      </div>
      <Chart options={chartOptions} series={chartOptions.series} type="area" height={300}  width={1000} />
    </div>
  );
};

export default MultipleAreaCharts;
