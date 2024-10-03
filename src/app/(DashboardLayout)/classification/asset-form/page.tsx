"use client";
import React, { useState } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/joy";
import { useQuery, gql, useMutation } from "@apollo/client";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { useRouter, useSearchParams } from "next/navigation";

const GET_ASSETS = gql`
  query GetAssets {
    assets {
      id
      name
      updatedAt
      description
      createdAt
    }
  }
`;

const GET_ASSET_TYPES = gql`
  query GetAssetTypes {
    assetTypes {
      createdAt
      description
      id
      name
      updatedAt
    }
  }
`;

const GET_ASSET_DEPARTMENTS = gql`
  query MyQuery {
    assetDepartments {
      id
      name
      reason
      assetValueMapping {
        id
        qualitativeValue
        crispValue
      }
    }
  }
`;

const GET_ASSET_VALUE_MAPPINGS = gql`
  query MyQuery {
    assetValueMapping {
      id
      qualitativeValue
      crispValue
      createdAt
      updatedAt
    }
  }
`;

const CREATE_ASSET_LISTING = gql`
  mutation CreateAssetListing($input: AssetListingInput!) {
    createAssetListing(input: $input) {
      assetListing {
        id
        asset
        assetType
        description
        ownerDepartment {
          id
          name
        }
        assetValue {
          id
          qualitativeValue
          crispValue
        }
        createdAt
        updatedAt
      }
    }
  }
`;

const UPDATE_ASSET_LISTING = gql`
  mutation UpdateAssetListing($id: ID!, $input: AssetListingInput!) {
    updateAssetListing(id: $id, input: $input) {
      assetListing {
        id
        asset
        assetType
        description
        ownerDepartment {
          name
        }
        assetValue {
          qualitativeValue
        }
      }
    }
  }
`;

const AssetFormPage: React.FC = () => {
  const searchParams = useSearchParams();

  const assetId = searchParams.get("id");
  const assetName = searchParams.get("asset_name");
  const typeAsset = searchParams.get("asset_type");
  const assetValue = searchParams.get("asset_value");
  const owner = searchParams.get("asset_owner");
  const desc = searchParams.get("description");

  const [asset, setAsset] = useState(assetName || "");
  const [assetType, setAssetType] = useState(typeAsset || "");
  const [assetOwner, setAssetOwner] = useState(owner || "");
  const [assetValueMapping, setAssetValueMapping] = useState(assetValue || "");
  const [description, setDescription] = useState(desc || "");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const {
    data: assetData,
    loading: assetLoading,
    error: assetError,
  } = useQuery(GET_ASSETS);
  const {
    data: assetTypeData,
    loading: assetTypeLoading,
    error: assetTypeError,
  } = useQuery(GET_ASSET_TYPES);
  const {
    data: departmentData,
    loading: departmentLoading,
    error: departmentError,
  } = useQuery(GET_ASSET_DEPARTMENTS);
  const {
    data: valueMappingData,
    loading: valueMappingLoading,
    error: valueMappingError,
  } = useQuery(GET_ASSET_VALUE_MAPPINGS);

  const [
    createAssetListing,
    { loading: createLoading, error: createError },
  ] = useMutation(CREATE_ASSET_LISTING);
  const [updateAssetListing, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_ASSET_LISTING);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (assetId) {
        // Update existing asset
        await updateAssetListing({
          variables: {
            id: assetId,
            input: {
              asset,
              assetType,
              ownerDepartmentId: assetOwner,
              assetValueId: assetValueMapping,
              description,
            },
          },
        });
        enqueueSnackbar("Asset has been updated successfully.", {
          variant: "success",
        });
      } else {
        // Create new asset
        await createAssetListing({
          variables: {
            input: {
              asset,
              assetType,
              ownerDepartmentId: assetOwner,
              assetValueId: assetValueMapping,
              description,
            },
          },
        });
        enqueueSnackbar("Asset has been added successfully.", {
          variant: "success",
        });
      }
      router.push("/classification/assets"); // Redirect after successful operation
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Loading states
  if (assetLoading || assetTypeLoading || departmentLoading || valueMappingLoading || createLoading || updateLoading)
    return <CircularProgress />;

  if (assetError || assetTypeError || departmentError || valueMappingError || createError || updateError)
    return <p>Error loading data</p>;

  return (
    <Box sx={{ padding: 4, paddingTop: 15, maxWidth: 700, margin: "0 auto" }}>
      <Typography
        variant="overline"
        sx={{
          marginBottom: 3,
          color: "black",
        }}
      >
        Add a New Asset
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          // border: "1px solid",
          borderColor: "grey.100",
          borderRadius: "md",
          padding: 3,
          // boxShadow: "sm",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="asset">Asset</InputLabel>
              <Select
                labelId="asset"
                id="asset"
                value={asset}
                label="Asset"
                onChange={(e) => setAsset(e.target.value)}
              >
                {assetData?.assets.map((asset: any) => (
                  <MenuItem key={asset.id} value={asset.name}>
                    {asset.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="asset-type-label">Asset Type</InputLabel>
              <Select
                labelId="asset-type-label"
                id="asset-type"
                value={assetType}
                label="Asset Type"
                onChange={(e) => setAssetType(e.target.value)}
              >
                {assetTypeData?.assetTypes.map((type: any) => (
                  <MenuItem key={type.id} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="asset-owner-label">Asset Owner</InputLabel>
              <Select
                labelId="asset-owner-label"
                id="asset-owner"
                value={assetOwner}
                label="Asset Owner"
                onChange={(e) => setAssetOwner(e.target.value)}
              >
                {departmentData?.assetDepartments.map((owner: any) => (
                  <MenuItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="asset-value-label">Asset Value</InputLabel>
              <Select
                labelId="asset-value-label"
                id="asset-value"
                value={assetValueMapping}
                label="Asset Value"
                onChange={(e) => setAssetValueMapping(e.target.value)}
              >
                {valueMappingData?.assetValueMapping.map((mapping: any) => (
                  <MenuItem key={mapping.id} value={mapping.id}>
                    {mapping.qualitativeValue}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              label="Description"
              multiline
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ alignSelf: "flex-end", mt: 2 }}
        >
          {assetId ? "Edit Asset" : "Add Asset"}
        </Button>
      </Box>
    </Box>
  );
};

export default AssetFormPage;
