"use client"
import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';

const ComparisonTable = ({ confusionMatrixData }: any) => {
    return (
        <TableContainer component={Paper} elevation={0} sx={{ boxShadow: 'none' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Metric</TableCell>
                        {confusionMatrixData.models.map((model: any) => (
                            <TableCell key={model}>{model}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>True Positives (TP)</TableCell>
                        {confusionMatrixData.confusionMatrices.map((matrix: any) => (
                            <TableCell key={matrix.TP}>{matrix.TP}</TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell>True Negatives (TN)</TableCell>
                        {confusionMatrixData.confusionMatrices.map((matrix: any) => (
                            <TableCell key={matrix.TN}>{matrix.TN}</TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell>False Positives (FP)</TableCell>
                        {confusionMatrixData.confusionMatrices.map((matrix: any) => (
                            <TableCell key={matrix.FP}>{matrix.FP}</TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell>False Negatives (FN)</TableCell>
                        {confusionMatrixData.confusionMatrices.map((matrix: any) => (
                            <TableCell key={matrix.FN}>{matrix.FN}</TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ComparisonTable;
