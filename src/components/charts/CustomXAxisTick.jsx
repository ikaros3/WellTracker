import React from 'react';

const CustomXAxisTick = ({ x, y, payload, index, data }) => {
    const [datePart, timePart] = payload.value.split(" ");
    const isNewDay =
        index === 0 || data[index - 1].name.split(" ")[0] !== datePart;
    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={25}
                textAnchor="middle"
                fontSize={12}
                fill="#374151"
            >
                <tspan x={0} dy={25}>
                    {timePart}
                </tspan>
                {isNewDay && (
                    <tspan x="0" dy={18} fontSize={11} fill="#6b7280" fontWeight="bold">
                        {datePart}
                    </tspan>
                )}
            </text>
        </g>
    );
};

export default CustomXAxisTick;
