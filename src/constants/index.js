// --- Data Constants ---
export const INITIAL_BP_DATA = [];
export const INITIAL_GLUCOSE_DATA = [];

// --- Meal Options ---
export const mealOptions = [
    { value: "fasting", label: "공복 (아침 식전)" },
    { value: "one_hour_after", label: "식후 1시간" },
    { value: "breakfast_after", label: "아침 식후 2시간" },
    { value: "lunch_after", label: "점심 식후 2시간" },
    { value: "dinner_after", label: "저녁 식후 2시간" },
    { value: "snack", label: "기타/간식 후" },
];

// --- Meal Status Map for CSV Export ---
export const mealStatusMap = {
    fasting: "공복 (아침 식전)",
    one_hour_after: "식후 1시간",
    breakfast_after: "아침 식후 2시간",
    lunch_after: "점심 식후 2시간",
    dinner_after: "저녁 식후 2시간",
    snack: "기타/간식 후",
};

// --- Reference Ranges for Glucose ---
export const REF_RANGES = {
    fasting: {
        normal: { y1: 70, y2: 99, color: "green", label: "정상" },
        pre: { y1: 100, y2: 125, color: "orange", label: "전단계" },
        danger: { y1: 126, y2: 300, color: "red", label: "관리필요" }
    },
    one_hour_after: {
        normal: { y1: 70, y2: 179, color: "green", label: "정상" },
        pre: { y1: 180, y2: 199, color: "orange", label: "전단계" },
        danger: { y1: 200, y2: 300, color: "red", label: "관리필요" }
    },
    two_hour_after: {
        normal: { y1: 70, y2: 139, color: "green", label: "정상" },
        pre: { y1: 140, y2: 199, color: "orange", label: "전단계" },
        danger: { y1: 200, y2: 300, color: "red", label: "관리필요" }
    },
    all: {
        normal: { y1: 70, y2: 140, color: "green", label: "일반 관리 목표" }
    }
};
