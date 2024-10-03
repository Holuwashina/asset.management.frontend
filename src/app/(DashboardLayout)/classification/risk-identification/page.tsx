"use client";

import React, { useEffect, useState } from "react";
import { Table } from "typescript-table";
import { ExportDataComponent } from "typescript-exportdata";
import { Column } from "typescript-table/dist/components/Table";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress"; // MUI spinner

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

const MyTableComponent: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(GET_ASSETS_LISTING);
  const [deleteAsset] = useMutation(DELETE_ASSET, {
    refetchQueries: [{ query: GET_ASSETS_LISTING }],
  });
  const [assetData, setAssetData] = useState([]);
  const [isClassifying, setIsClassifying] = useState(false); // Track classification status
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const datasExample = assetData.map((asset: any) => {
    return {
      id: asset.id,
      assetName: asset.asset,
      description: asset.description,
      assetType: asset.assetType,
      owner: asset.ownerDepartment.name,
      assetValue: asset.assetValue.qualitativeValue,
      classification: asset.classification,
      confidentiality: asset.confidentiality?.toFixed(2),
      integrity: asset.integrity?.toFixed(2),
      availability: asset.availability?.toFixed(2),
      risk: asset.riskIndex?.toFixed(2),
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
  ];

  const handleArchiveRow = (id: number | string) => {
    setIsClassifying(true); // Start spinner
    router.push(`/classification/asset-assessment?id=${id}`);
    setIsClassifying(false); // Stop spinner immediately after navigation
  };

  const handleDeleteRow = async (id: number | string) => {
    confirm({
      description:
        "Warning: You are about to delete the asset. This action is permanent and cannot be reversed. Do you wish to continue?",
    })
      .then(async () => {
        const response = await deleteAsset({ variables: { id } });
        if (response.data.deleteAsset.success) {
          enqueueSnackbar("Great! asset has been successfully deleted.", {
            variant: "success",
          });
        } else {
          enqueueSnackbar("Oops! try again later.", { variant: "error" });
        }
      })
      .catch(() => {
        enqueueSnackbar("Oops! try again later.", { variant: "error" });
      });
  };

  return (
    <>
      {isClassifying && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <CircularProgress />
        </div>
      )}
      <Table
        background="#1976d2" //change background button and dropdown
        color="#fff" //change color button and dropdown
        hoverBackground="#1565c0" //change background :hover button and dropdown
        selectedRowsBackground="#1976d2" //change background selected rows
        data={datasExample}
        columns={columnsExample}
        archiveRowColumnVisible
        handleArchiveRow={handleArchiveRow}
        deleteRowColumnVisible
        handleDeleteRow={handleDeleteRow}
        renderExportDataComponent={(filteredData, columnsManaged) => (
          <ExportDataComponent
            background="#1976d2" //change background button and dropdown
            color="#fff" //change color button and dropdown
            hoverBackground="#1565c0" //change background :hover button and dropdown
            filteredData={filteredData}
            columnsManaged={columnsManaged}
            headerProperty="label"
            csvExport={true}
            excelExport={true}
            pdfExport={true}
          />
        )}
      />
    </>
  );
};

export default MyTableComponent;
