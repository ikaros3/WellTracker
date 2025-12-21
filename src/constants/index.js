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
