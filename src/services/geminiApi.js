// --- Gemini API Setup ---
const GEMINI_API_KEY = ""; // Provided by runtime environment

export const callGeminiAPI = async (prompt) => {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return (
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "분석 결과를 가져올 수 없습니다."
        );
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "AI 서비스 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
};
