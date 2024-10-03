import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Typography, Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

// GraphQL Query to Fetch Asset Listings
const GET_ASSETS_LISTING = gql`
  query GetAssetsListing {
    assetsListing {
      id
      asset
      assetType
      createdAt
      ensemblePredictedRiskLevel
      ownerDepartment {
        name
      }
    }
  }
`;

const AssetPerformance: React.FC = () => {
  const { data, loading, error } = useQuery(GET_ASSETS_LISTING);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (data && data.assetsListing) {
      // Transform the data to match the structure required by the table
      const transformedData = data.assetsListing.map((asset: any, index: number) => ({
        id: index + 1,  // Numbering the ID
        assetName: asset.asset,
        assetType: asset.assetType,
        assetOwner: asset.ownerDepartment.name,
        riskLevel: asset.ensemblePredictedRiskLevel || "Unknown",
        riskLevelColor: getPriorityColor(asset.ensemblePredictedRiskLevel),
        createdAt: new Date(asset.createdAt).toLocaleDateString(),
      }));
      setAssets(transformedData);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "error.main";
      case "Medium":
        return "secondary.main";
      case "Low":
        return "primary.main";
      case "Critical":
        return "success.main";
      default:
        return "grey.500";
    }
  };

  return (
    <DashboardCard title="Asset Classification Listing">
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: "nowrap",
            mt: 2
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={500}>
                  No.
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={500}>
                  Asset Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={500}>
                  Asset Type
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={500}>
                  Asset Owner
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight={500}>
                  Risk Level
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight={500}>
                  Date
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((asset: any) => (
              <TableRow key={asset.id}>
                <TableCell>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    {asset.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" fontWeight={500}>
                    {asset.assetName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" fontWeight={500}>
                    {asset.assetType}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" fontWeight={500}>
                    {asset.assetOwner}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    sx={{
                      px: "4px",
                      backgroundColor: asset.riskLevelColor,
                      color: "#fff",
                    }}
                    size="small"
                    label={asset.riskLevel}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="overline">{asset.createdAt}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </DashboardCard>
  );
};

export default AssetPerformance;
