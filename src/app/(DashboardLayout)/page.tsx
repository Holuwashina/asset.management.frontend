"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import AssetLists from "@/app/(DashboardLayout)/components/dashboard/AssetLists";
import AssetClassified from "@/app/(DashboardLayout)/components/dashboard/AssetClassified";
import AssetRisk from "./components/dashboard/AssetRisk";
import AssetAnalyzed from "./components/dashboard/AssetAnalyzed";
import AssetPerformance from "@/app/(DashboardLayout)/components/dashboard/AssetPerformance";
import { useQuery, gql } from "@apollo/client";

// Define GraphQL query
const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    assetMetrics {
      totalAssets
      classifiedAssets
      riskAnalyzed
      riskIdentified
    }
  }
`;

const Dashboard = () => {
  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const { assetMetrics } = data;

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <AssetLists
              totalAssets={assetMetrics.totalAssets}
              chartSeries={[]} // Use actual data
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <AssetClassified
              classifiedAssetsValue={assetMetrics.classifiedAssets}
              chartData={[]} // Use actual data
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <AssetAnalyzed
              riskAnalyzedValue={assetMetrics.riskAnalyzed}
              chartData={[]} // Use actual data
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <AssetRisk
              riskIdentifiedValue={assetMetrics.riskIdentified}
              chartSeries={[]} // Use actual data
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <AssetPerformance />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
