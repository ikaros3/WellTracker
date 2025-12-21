import React from 'react';

const CustomBPDot = (props) => {
    const { cx, cy, payload, dataKey, stroke } = props;
    const value = payload[dataKey];
    let fillColor = "#fff";
    let strokeColor = stroke;
    let r = 4;
    let isWarningOrDanger = false;

    if (dataKey === "systolic") {
        if (value >= 120) isWarningOrDanger = true;
        if (value >= 140) {
            strokeColor = "#dc2626";
            fillColor = "#fee2e2";
        } else if (value >= 120) {
            strokeColor = "#d97706";
            fillColor = "#fef3c7";
        }
    } else if (dataKey === "diastolic") {
        if (value >= 80) isWarningOrDanger = true;
        if (value >= 90) {
            strokeColor = "#dc2626";
            fillColor = "#fee2e2";
        } else if (value >= 80) {
            strokeColor = "#d97706";
            fillColor = "#fef3c7";
        }
    }

    if (isWarningOrDanger) {
        return (
            <g>
                <circle
                    cx={cx}
                    cy={cy}
                    r={7}
                    stroke={strokeColor}
                    strokeWidth={2}
                    fill={fillColor}
                />
                <circle cx={cx} cy={cy} r={3} fill={strokeColor} />
            </g>
        );
    }
    return (
        <circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={strokeColor}
            strokeWidth={2}
            fill={fillColor}
        />
    );
};

export default CustomBPDot;
