import React from 'react';

const CustomYAxisTick = ({ x, y, payload, unit }) => (
    <g transform={`translate(30,${y})`}>
        <text x={0} y={0} dy={4} textAnchor="middle" fontSize={12} fill="#374151">
            {payload.value}
        </text>
    </g>
);

export default CustomYAxisTick;
