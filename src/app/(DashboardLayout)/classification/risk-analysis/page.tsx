"use client";

import React, { useEffect, useState } from "react";
import { Table } from "typescript-table";
import { ExportDataComponent } from "typescript-exportdata";
import { Column } from "typescript-table/dist/components/Table";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import CircularProgress from '@mui/material/CircularProgress';

const GET_ASSETS_LISTING = gql`
  query GetAssetsListing {
    assetsListing {
      id
      asset
      assetType
      availability
      confidentiality
      integrity
      riskIndex
      ensemblePredictedRiskLevel
      ownerDepartment {
        id
        name
      }
      assetValue {
        id
        qualitativeValue
      }
      classification
      classificationValue
      description
    }
  }
`;

const DELETE_ASSET = gql`
  mutation DeleteAsset($id: ID!) {
    deleteAsset(id: $id) {
      success
    }
  }
`;

const ANALYZE_RISK = gql`
  mutation AnalyzeRisk($id: ID!) {
    analyzeRisk(id: $id) {
      success
      updatedAt
    }
  }
`;

const RiskAnalysis: React.FC = () => {
  const { data, loading: loadingAssets, error, refetch } = useQuery(GET_ASSETS_LISTING);
  const [deleteAsset] = useMutation(DELETE_ASSET, {
    refetchQueries: [{ query: GET_ASSETS_LISTING }],
  });
  const [analyzeRisk, { loading: loadingAnalyze }] = useMutation(ANALYZE_RISK, {
    refetchQueries: [{ query: GET_ASSETS_LISTING }],
  });
  const [assetData, setAssetData] = useState([]);
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    refetch(); // Trigger refetch on mount
  }, [refetch]);

  useEffect(() => {
    if (data && data.assetsListing) {
      setAssetData(data.assetsListing);
    }
  }, [data]);

  if (loadingAssets) return <p>Loading assets...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const datasExample = assetData
    .filter((asset: any) => 
      asset.confidentiality !== null &&
      asset.integrity !== null &&
      asset.availability !== null
    )
    .map((asset: any) => {
      return {
        id: asset.id,
        assetName: asset.asset,
        description: asset.description,
        assetType: asset.assetType,
        owner: asset.ownerDepartment.name,
        assetValue: asset.assetValue.qualitativeValue,
        classification: asset.classification,
        confidentiality: asset.confidentiality.toFixed(2),
        integrity: asset.integrity.toFixed(2),
        availability: asset.availability.toFixed(2),
        risk: asset.riskIndex.toFixed(2),
        risk_level: asset.ensemblePredictedRiskLevel,
      };
    });

  const columnsExample: Column[] = [
    { label: "Asset Name", property: "assetName" },
    { label: "Description", property: "description" },
    { label: "Asset Type", property: "assetType" },
    { label: "Asset Owner", property: "owner" },
    { label: "Asset Classification", property: "classification" },
    { label: "Confidentiality Score", property: "confidentiality" },
    { label: "Integrity Score", property: "integrity" },
    { label: "Availability Score", property: "availability" },
    { label: "Risk Index", property: "risk" },
    { label: "Risk Level", property: "risk_level" },
  ];

  const handleRiskAnalyze = async (id: number | string) => {
    try {
      const response = await analyzeRisk({ variables: { id } });
      console.log(response);

      enqueueSnackbar("Risk analyzed successfully.", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("An error occurred while updating risk analysis.", {
        variant: "error",
      });
    }
  };

  const handleDeleteRow = async (id: number | string) => {
    confirm({
      description:
        "Warning: You are about to delete the asset. This action is permanent and cannot be reversed. Do you wish to continue?",
    })
      .then(async () => {
        const response = await deleteAsset({ variables: { id } });
        if (response.data.deleteAsset.success) {
          enqueueSnackbar("Great! asset has been successfuly deleted.", {
            variant: "success",
          });
        } else {
          enqueueSnackbar("Ooops! try again later.", { variant: "error" });
        }
      })
      .catch(() => {
        enqueueSnackbar("Ooops! try again later.", { variant: "error" });
      });
  };

  return (
    <div>
      {loadingAnalyze && (
        <div style={{ display: 'flex', justifyContent: 'left', marginBottom: '20px' }}>
          <CircularProgress />
        </div>
      )}
      <Table
        background="#1976d2"
        color="#fff"
        hoverBackground="#1565c0"
        selectedRowsBackground="#1976d2"
        data={datasExample}
        columns={columnsExample}
        archiveRowColumnVisible
        handleArchiveRow={handleRiskAnalyze}
        renderExportDataComponent={(filteredData, columnsManaged) => (
          <ExportDataComponent
            background="#1976d2"
            color="#fff"
            hoverBackground="#1565c0"
            filteredData={filteredData}
            columnsManaged={columnsManaged}
            headerProperty="label"
            csvExport={true}
            excelExport={true}
            pdfExport={true}
          />
        )}
      />
    </div>
  );
};

export default RiskAnalysis;
