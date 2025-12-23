import React from 'react';

const CustomGlucoseDot = (props) => {
    const { cx, cy, payload, stroke } = props;
    const value = payload.level;
    const statusLevel = payload.statusLevel; // 'normal', 'pre', 'danger' passed from parent

    let fillColor = "#fff";
    let strokeColor = stroke;
    let r = 4;
    let isWarningOrDanger = false;

    if (statusLevel === "danger") {
        isWarningOrDanger = true;
        strokeColor = "#dc2626"; // Red
        fillColor = "#fee2e2";
    } else if (statusLevel === "pre") {
        isWarningOrDanger = true; // Use special dot for pre as well? User asked for orange.
        strokeColor = "#f97316"; // Orange-500
        fillColor = "#ffedd5"; // Orange-100
    }
    // Normal stays default (teal stroke, white fill)

    if (isWarningOrDanger) {
        return (
            <g>
                <circle
                    cx={cx}
                    cy={cy}
                    r={statusLevel === 'danger' ? 7 : 6}
                    stroke={strokeColor}
                    strokeWidth={2}
                    fill={fillColor}
                />
                <circle cx={cx} cy={cy} r={statusLevel === 'danger' ? 3 : 2} fill={strokeColor} />
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
