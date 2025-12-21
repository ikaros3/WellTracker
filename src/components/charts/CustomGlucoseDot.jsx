import React from 'react';

const CustomGlucoseDot = (props) => {
    const { cx, cy, payload, stroke } = props;
    const value = payload.level;
    const status = payload.mealStatus;
    let fillColor = "#fff";
    let strokeColor = stroke;
    let r = 4;
    let isWarningOrDanger = false;

    if (status === "fasting") {
        if (value >= 100) isWarningOrDanger = true;
        if (value >= 126 || value < 70) {
            strokeColor = "#dc2626";
            fillColor = "#fee2e2";
        } else if (value >= 100) {
            strokeColor = "#d97706";
            fillColor = "#fef3c7";
        }
    } else {
        if (value >= 140) isWarningOrDanger = true;
        if (value >= 200 || value < 70) {
            strokeColor = "#dc2626";
            fillColor = "#fee2e2";
        } else if (value >= 140) {
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

export default CustomGlucoseDot;
