// ConfusionMatrix.js
import React from 'react';
import Plot from 'react-plotly.js';

const ConfusionMatrix = ({ data }: any) => {
    const { TP, TN, FP, FN } = data;

    const matrix = [
        [TP, FP],
        [FN, TN],
    ];

    return (
        <Plot
            data={[
                {
                    z: matrix,
                    x: ['Predicted Positive', 'Predicted Negative'],
                    y: ['Actual Positive', 'Actual Negative'],
                    type: 'heatmap',
                    colorscale: 'YlGnBu',
                },
            ]}
            layout={{
                title: 'Confusion Matrix',
                xaxis: { title: 'Predicted' },
                yaxis: { title: 'Actual' },
                width: 600,
                height: 500,
            }}
        />
    );
};

export default ConfusionMatrix;
