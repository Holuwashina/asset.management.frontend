"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Container,
  Paper,
  Divider,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { gql, useQuery, useMutation } from "@apollo/client";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

// GraphQL Queries and Mutations
export const GET_ASSESSMENT_CATEGORIES = gql`
  query GetAssessmentCategories {
    assessmentCategories {
      id
      name
    }
  }
`;

export const ADD_ASSESSMENT_QUESTION = gql`
  mutation AddAssessmentQuestion($categoryId: ID!, $questionText: String!) {
    createAssessmentQuestion(
      input: { categoryId: $categoryId, questionText: $questionText }
    ) {
      assessmentQuestion {
        id
        questionText
      }
    }
  }
`;

const AddAssessmentForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [
    addAssessmentQuestion,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(ADD_ASSESSMENT_QUESTION);

  const { loading, error, data } = useQuery(GET_ASSESSMENT_CATEGORIES);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!category || !question) {
      return; // Add validation logic or error message display here
    }

    try {
      await addAssessmentQuestion({
        variables: {
          categoryId: category,
          questionText: question,
        },
      });
      // Reset form after successful submission
      setQuestion("");
      setCategory("");
      enqueueSnackbar("Assessment has been added successfully.", {
        variant: "success",
      });
      router.push("/settings/asset-assessment"); 
    } catch (err) {
      console.error("Error adding assessment question:", err);
    }
  };

  if (loading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Error fetching categories</Typography>;

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 0 }}>
        <Typography variant="overline" align="left" gutterBottom>
          Add New Assessment
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormControl component="fieldset" fullWidth>
            <Typography variant="overline" gutterBottom>
              Select Category
            </Typography>
            <RadioGroup
              aria-label="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              row
            >
              {data.assessmentCategories.map((cat: any) => (
                <FormControlLabel
                  key={cat.id}
                  value={cat.id}
                  control={<Radio />}
                  label={cat.name}
                />
              ))}
            </RadioGroup>
            {category === "" && (
              <FormHelperText>Select a category</FormHelperText>
            )}
          </FormControl>

          <TextField
            label="Assessment"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, width: 200 }}
            disabled={mutationLoading}
          >
            {mutationLoading ? "Submitting..." : "Add Assessment"}
          </Button>

          {mutationError && (
            <Typography color="error" sx={{ mt: 2 }}>
              Error adding assessment question: {mutationError.message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AddAssessmentForm; 
