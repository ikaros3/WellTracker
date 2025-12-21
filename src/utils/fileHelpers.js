import { mealStatusMap } from '../constants';

// --- File Download Helper (CSV Export) ---
export const downloadCSV = (data, type) => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    if (type === "bp") {
        csvContent += "날짜,시간,수축기(최고),이완기(최저),혈압약 복용\n";
        data.forEach((row) => {
            csvContent += `${row.date},${row.time},${row.systolic},${row.diastolic},${row.medsTaken ? "복용함" : "미복용"
                }\n`;
        });
    } else {
        csvContent += "날짜,시간,측정 시점,혈당 수치(mg/dL),당뇨약 복용\n";
        data.forEach((row) => {
            csvContent += `${row.date},${row.time},${mealStatusMap[row.mealStatus] || row.mealStatus
                },${row.level},${row.medsTaken ? "복용함" : "미복용"}\n`;
        });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
        "download",
        `${type === "bp" ? "혈압" : "혈당"}_기록_${new Date()
            .toISOString()
            .slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
