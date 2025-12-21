import React from 'react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const systolic = payload.find((p) => p.dataKey === "systolic");
        const diastolic = payload.find((p) => p.dataKey === "diastolic");
        const glucose = payload.find((p) => p.dataKey === "level");

        return (
            <div
                className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg text-xs"
                style={{ minWidth: "120px" }}
            >
                <p className="font-bold text-gray-700 mb-2 border-b pb-1">{label}</p>
                {systolic && (
                    <div className="flex items-center justify-between gap-3 text-red-600 mb-1">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            수축기(최고)
                        </span>
                        <span className="font-bold">{systolic.value}</span>
                    </div>
                )}
                {diastolic && (
                    <div className="flex items-center justify-between gap-3 text-blue-600">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            이완기(최저)
                        </span>
                        <span className="font-bold">{diastolic.value}</span>
                    </div>
                )}
                {glucose && (
                    <div className="flex items-center justify-between gap-3 text-teal-600">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-teal-600"></span>혈당
                        </span>
                        <span className="font-bold">{glucose.value}</span>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export default CustomTooltip;
