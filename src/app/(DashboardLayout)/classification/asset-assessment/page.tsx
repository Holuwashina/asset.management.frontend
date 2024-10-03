"use client";

import * as React from "react";
import { useMutation, useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";

// Import the GraphQL query
import { gql } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "notistack";

// GraphQL query to get asset value mappings
const GET_ALL_ASSET_VALUE_MAPPINGS = gql`
  query {
    assetValueMapping {
      id
      qualitativeValue
      crispValue
    }
  }
`;

// GraphQL query to get assessment questions
const GET_ALL_QUESTIONS = gql`
  query {
    assessmentQuestions {
      id
      questionText
      category {
        name
      }
    }
  }
`;

const IDENTIFY_RISK = gql`
  mutation IdentifyRisk(
    $id: ID!
    $confidentiality: Float
    $integrity: Float
    $availability: Float
  ) {
    identifyRisk(
      id: $id
      confidentiality: $confidentiality
      integrity: $integrity
      availability: $availability
    ) {
      success
    }
  }
`;

export default function AssetAssessment() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [responses, setResponses] = React.useState<{ [key: string]: string }>(
    {}
  );
  const [identifyRisk] = useMutation(IDENTIFY_RISK);
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const assetId = searchParams.get("id");

  // Fetch questions using Apollo Client
  const {
    loading: questionsLoading,
    error: questionsError,
    data: questionsData,
  } = useQuery(GET_ALL_QUESTIONS);

  // Fetch asset value mappings using Apollo Client
  const {
    loading: assetLoading,
    error: assetError,
    data: assetData,
  } = useQuery(GET_ALL_ASSET_VALUE_MAPPINGS);

  if (questionsLoading || assetLoading) return <CircularProgress />;
  if (questionsError || assetError)
    return <p>Error: {questionsError?.message || assetError?.message}</p>;

  const questions = questionsData.assessmentQuestions;
  const assetValueMappings = assetData.assetValueMapping;
  const maxSteps = questions.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (questionId: string, value: string) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const calculateMean = (category: string) => {
    const categoryQuestions = questions.filter(
      (q: any) => q.category.name === category
    );
    const categoryResponses = categoryQuestions.map((q: any) =>
      parseFloat(responses[q.id] || "0")
    );

    const sum = categoryResponses.reduce((acc: any, val: any) => acc + val, 0);
    const mean =
      categoryResponses.length > 0 ? sum / categoryResponses.length : 0;

    return mean;
  };

  const handleSubmit = async () => {
    const confidentialityMean = calculateMean("Confidentiality");
    const integrityMean = calculateMean("Integrity");
    const availabilityMean = calculateMean("Availability");

    try {
      const { data } = await identifyRisk({
        variables: {
          id: assetId,
          confidentiality: confidentialityMean,
          integrity: integrityMean,
          availability: availabilityMean,
        },
      });

      enqueueSnackbar("Risk assessment generated successfully.", {
        variant: "success",
      });

      router.push("/classification/risk-identification");
    } catch (error) {
      console.error("Error submitting risk identification:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: 10 }}>
      <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
        <Paper
          square
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            height: 50,
            pl: 2,
            bgcolor: "background.default",
          }}
        >
          <Typography>{questions[activeStep].category.name}</Typography>
        </Paper>
        <Box sx={{ height: 255, maxWidth: 400, width: "100%", p: 2 }}>
          <Typography>{questions[activeStep].questionText}</Typography>
          <RadioGroup
            name={`question-${questions[activeStep].id}`}
            value={responses[questions[activeStep].id] || ""}
            onChange={(e) =>
              handleChange(questions[activeStep].id, e.target.value)
            }
          >
            {assetValueMappings.map((mapping: any) => (
              <FormControlLabel
                key={mapping.id}
                value={mapping.crispValue.toString()}
                control={<Radio />}
                label={mapping.qualitativeValue}
              />
            ))}
          </RadioGroup>
        </Box>
        <MobileStepper
          sx={{ paddingTop: 10 }}
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
        {activeStep === maxSteps - 1 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ marginTop: 3 }}
          >
            Submit
          </Button>
        )}
      </Box>
    </Box>
  );
}
