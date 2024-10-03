"use client";

import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useConfirm } from "material-ui-confirm";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";

// GraphQL Queries
const GET_CONFIDENTIALITY_QUESTIONS = gql`
  query GetConfidentialityQuestions {
    confidentialityQuestions {
      id
      questionText
    }
  }
`;

const GET_INTEGRITY_QUESTIONS = gql`
  query GetIntegrityQuestions {
    integrityQuestions {
      id
      questionText
    }
  }
`;

const GET_AVAILABILITY_QUESTIONS = gql`
  query GetAvailabilityQuestions {
    availabilityQuestions {
      id
      questionText
    }
  }
`;

const DELETE_ASSESSMENT_QUESTION = gql`
  mutation DeleteAssessmentQuestion($id: ID!) {
    deleteAssessmentQuestion(id: $id) {
      success
    }
  }
`;

const InformationAssetAssessment = () => {
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const {
    loading: loadingConf,
    data: dataConf,
    refetch: refetchConf,
  } = useQuery(GET_CONFIDENTIALITY_QUESTIONS);
  const {
    loading: loadingInt,
    data: dataInt,
    refetch: refetchInt,
  } = useQuery(GET_INTEGRITY_QUESTIONS);
  const {
    loading: loadingAvail,
    data: dataAvail,
    refetch: refetchAvail,
  } = useQuery(GET_AVAILABILITY_QUESTIONS);

  const [deleteAssessmentQuestion] = useMutation(DELETE_ASSESSMENT_QUESTION, {
    onCompleted: () => {
      refetchConf();
      refetchInt();
      refetchAvail();
    },
  });

  const handleDelete = async (id: string) => {
    confirm({
      description:
        "Warning: You are about to delete the assessment. This action is permanent and cannot be reversed. Do you wish to continue?",
    });
    try {
      await deleteAssessmentQuestion({ variables: { id } });
      enqueueSnackbar("Assessment has been deleted successfully.", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  if (loadingConf || loadingInt || loadingAvail) {
    return <CircularProgress />;
  }

  return (
    <Box
      sx={{ p: 4, maxWidth: "100%", margin: "auto", mt: 4, overflowX: "auto" }}
    >
      <Typography variant="h5" gutterBottom align="center">
        INFORMATION ASSET ASSESSMENT
      </Typography>

      <TableContainer component={Paper} sx={{ border: "1px solid #000" }}>
        <Table aria-label="information asset assessment table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Questions</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Confidentiality Section */}
            <TableRow>
              <TableCell colSpan={3} style={{ backgroundColor: "#f0f0f0" }}>
                <Typography variant="h6">Confidentiality</Typography>
              </TableCell>
            </TableRow>
            {dataConf.confidentialityQuestions.map(
              (question: any, index: any) => (
                <TableRow key={question.id}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {question.questionText}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(question.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            )}

            {/* Integrity Section */}
            <TableRow>
              <TableCell colSpan={3} style={{ backgroundColor: "#f0f0f0" }}>
                <Typography variant="h6">Integrity</Typography>
              </TableCell>
            </TableRow>
            {dataInt.integrityQuestions.map((question: any, index: any) => (
              <TableRow key={question.id}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {question.questionText}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(question.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {/* Availability Section */}
            <TableRow>
              <TableCell colSpan={3} style={{ backgroundColor: "#f0f0f0" }}>
                <Typography variant="h6">Availability</Typography>
              </TableCell>
            </TableRow>
            {dataAvail.availabilityQuestions.map(
              (question: any, index: any) => (
                <TableRow key={question.id}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {question.questionText}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(question.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InformationAssetAssessment;
