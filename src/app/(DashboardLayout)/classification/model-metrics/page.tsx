"use client"; // This line ensures the component runs only on the client side

import React from "react"; // Removed useEffect as it wasn't used
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { styled } from "@mui/material/styles";
import ConfusionMatrix from "../../components/dashboard/ConfusionMatrix";
import ComparisonTable from "../../components/dashboard/ConfusionMatrixTable";

// Initialize Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Define TypeScript interfaces
interface ConfusionMatrixData {
  TP: number;
  FN: number;
  FP: number;
  TN: number;
}

interface ModelMetrics {
  precision: number;
  recall: number;
  f1Score: number;
}

interface ModelMetricsData {
  models: string[];
  metrics: string[];
  results: {
    [key: string]: ModelMetrics; // Flexible structure for metrics
  };
}

const confusionMatrixData = {
  models: ["Decision Tree", "Random Forest", "Ensemble Model"],
  confusionMatrices: [
    { TP: 64, FN: 16, FP: 11, TN: 9 },
    { TP: 83, FN: 8, FP: 10, TN: 0 },
    { TP: 90, FN: 5, FP: 9, TN: 0 },
  ],
};

// Dummy data for model metrics
const dummyData = {
  models: ["Decision Tree", "Random Forest", "Ensemble Model"],
  metrics: {
    precision: [0.85, 0.89, 0.92],
    recall: [0.8, 0.91, 0.95],
    f1Score: [0.82, 0.9, 0.93],
  },
};

const modelMetrics: ModelMetricsData = {
  metrics: ["Precision", "Recall", "F1-Score"],
  models: ["Decision Tree", "Random Forest", "Ensemble Model"],
  results: {
    "Decision Tree": { precision: 0.85, recall: 0.8, f1Score: 0.82 },
    "Random Forest": { precision: 0.89, recall: 0.91, f1Score: 0.9 },
    "Ensemble Model": { precision: 0.92, recall: 0.95, f1Score: 0.93 },
  },
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${TableCell}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  [`&.${TableCell}`]: {
    fontSize: 14,
  },
}));

const MetricsTable = () => {
  const bestModelIndex = dummyData.metrics.f1Score.indexOf(
    Math.max(...dummyData.metrics.f1Score)
  );

  const allModelsData = {
    labels: ["Precision", "Recall", "F1-Score"],
    datasets: [
      {
        label: "Decision Tree",
        data: [
          dummyData.metrics.precision[0],
          dummyData.metrics.recall[0],
          dummyData.metrics.f1Score[0],
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Random Forest",
        data: [
          dummyData.metrics.precision[1],
          dummyData.metrics.recall[1],
          dummyData.metrics.f1Score[1],
        ],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
      {
        label: "Ensemble Model",
        data: [
          dummyData.metrics.precision[2],
          dummyData.metrics.recall[2],
          dummyData.metrics.f1Score[2],
        ],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };

  const bestModelData = {
    labels: dummyData.models,
    datasets: [
      {
        label: "F1-Score",
        data: dummyData.metrics.f1Score,
        backgroundColor: dummyData.models.map((_, index) =>
          index === bestModelIndex
            ? "rgba(255, 99, 132, 0.6)"
            : "rgba(255, 159, 64, 0.6)"
        ),
      },
    ],
  };

  return (
    <Box sx={{ padding: 4 }}>
      <h3>Model Metrics</h3>

      <TableContainer
        component={Paper}
        sx={{ margin: "auto", boxShadow: "none" }}
        elevation={0}
      >
        <Table sx={{ minWidth: 700 }} aria-label="metrics table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Model</StyledTableCell>
              {modelMetrics.metrics.map((metric) => (
                <StyledTableCell key={metric} align="center">
                  {metric}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {modelMetrics.models.map((model) => (
              <TableRow key={model}>
                <StyledTableCell>{model}</StyledTableCell>
                <StyledTableCell align="center">
                  {modelMetrics.results[model].precision}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {modelMetrics.results[model].recall}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {modelMetrics.results[model].f1Score}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bar Chart Section for All Models */}
      <Box sx={{ mt: 4 }}>
        <h3>Metrics Comparison Bar Chart</h3>
        <Bar
          data={allModelsData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top" as const,
              },
              title: {
                display: true,
                text: "Performance Metrics by Model",
              },
            },
            scales: {
              x: {
                stacked: false,
              },
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </Box>

      {/* Bar Chart Section for Best Performing Model */}
      <Box sx={{ mt: 4 }}>
        <h3>Best Performing Model</h3>
        <Bar data={bestModelData} options={{ responsive: true }} />
      </Box>

      <Box sx={{ my: 5 }}>
        {confusionMatrixData.models.map((model, index) => (
          <div key={model} style={{ marginBottom: "30px", display: "flex" }}>
            <h3>{model}</h3>
            <ConfusionMatrix
              data={confusionMatrixData.confusionMatrices[index]}
            />
          </div>
        ))}
        <div>
          <h3>Confusion Matrix Table</h3>
          <ComparisonTable confusionMatrixData={confusionMatrixData} />
        </div>
      </Box>
    </Box>
  );
};

export default MetricsTable;
