import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

// Define the props type
interface AssetRiskProps {
  riskIdentifiedValue: number; // The value to be displayed in Typography
  chartSeries: number[]; // The data for the chart series
}

const AssetRisk: React.FC<AssetRiskProps> = ({ riskIdentifiedValue, chartSeries }) => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = '#ecf2ff';
  const successlight = theme.palette.success.light;

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [primary, primarylight, '#F9F9FD'],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };
  
  const seriescolumnchart: any = [38, 40, 25];

  return (
    <DashboardCard title="RISK IDENTIFIED">
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={7} sm={7}>
          <Typography variant="h3" fontWeight="700">
            {riskIdentifiedValue} {/* Use the riskIdentifiedValue prop */}
          </Typography>
        </Grid>
        {/* column */}
        <Grid item xs={5} sm={5}>
        <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="donut"
            height={122} width={"100%"}
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default AssetRisk;
