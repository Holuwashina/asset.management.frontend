"use client";

import React, { useEffect, useState } from "react";
import { Table } from "typescript-table";
import { ExportDataComponent } from "typescript-exportdata";
import { Column } from "typescript-table/dist/components/Table";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import CircularProgress from '@mui/material/CircularProgress'; // Import the spinner

const GET_ASSETS_LISTING = gql`
  query GetAssetsListing {
    assetsListing {
      id
      asset
      assetType
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

const CLASSIFY_ASSET = gql`
  mutation ClassifyAsset($id: ID!) {
    classifyAsset(id: $id) {
      success
      asset {
        id
        classification
        classificationValue
      }
    }
  }
`;

const MyTableComponent: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(GET_ASSETS_LISTING);
  const [deleteAsset] = useMutation(DELETE_ASSET, {
    refetchQueries: [{ query: GET_ASSETS_LISTING }],
  });
  const [classifyAsset] = useMutation(CLASSIFY_ASSET, {
    refetchQueries: [{ query: GET_ASSETS_LISTING }],
  });
  const [assetData, setAssetData] = useState([]);
  const [classifying, setClassifying] = useState(false); // State to track classification
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
    };
  });

  const columnsExample: Column[] = [
    { label: "Asset Name", property: "assetName" },
    { label: "Description", property: "description" },
    { label: "Asset Type", property: "assetType" },
    { label: "Asset Owner", property: "owner" },
    { label: "Asset Value", property: "assetValue" },
    { label: "Asset Classification", property: "classification" },
  ];

  const handleClassifyAsset = async (id: number | string) => {
    setClassifying(true); // Start showing spinner
    try {
      const response = await classifyAsset({ variables: { id } });
      if (response.data.classifyAsset.success) {
        enqueueSnackbar("Asset classified successfully.", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Failed to classify asset. Please try again.", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred during classification.", {
        variant: "error",
      });
    } finally {
      setClassifying(false); // Stop showing spinner
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
          enqueueSnackbar("Great! Asset has been successfully deleted.", {
            variant: "success",
          });
        } else {
          enqueueSnackbar("Ooops! Try again later.", { variant: "error" });
        }
      })
      .catch(() => {
        enqueueSnackbar("Ooops! Try again later.", { variant: "error" });
      });
  };

  return (
    <>
      {/* Show spinner when classifying asset */}
      {classifying && (
        <div style={{ display: 'flex', justifyContent: 'left', marginBottom: '20px' }}>
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
        editRowColumnVisible
        archiveRowColumnVisible
        handleArchiveRow={handleClassifyAsset}
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

