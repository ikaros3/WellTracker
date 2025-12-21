import React, { useState } from 'react';
import { BrainCircuit, Sparkles, RefreshCw, AlertCircle, MessageSquare } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { callGeminiAPI } from '../../services/geminiApi';

function AIInsightSection({ profile, bpRecords, glucoseRecords }) {
    const [loading, setLoading] = useState(false);
    const [insight, setInsight] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerateInsight = async () => {
        setLoading(true);
        setError(null);
        setInsight(null);

        const prompt = `
      역할: 전문적이고 친절한 건강 관리 코치
      사용자 정보:
      - 나이: ${profile.birthdate
                ? new Date().getFullYear() - new Date(profile.birthdate).getFullYear()
                : "미상"
            }세
      - 성별: ${profile.gender === "male" ? "남성" : "여성"}
      - 복용 약물: ${Object.entries(profile.meds)
                .filter(([_, v]) => v)
                .map(([k]) => k)
                .join(", ") || "없음"
            }

      최근 혈압 기록 (최신순 5개):
      ${bpRecords
                .slice(-5)
                .reverse()
                .map((r) => `- ${r.date} ${r.time}: ${r.systolic}/${r.diastolic}`)
                .join("\n") || "기록 없음"
            }

      최근 혈당 기록 (최신순 5개):
      ${glucoseRecords
                .slice(-5)
                .reverse()
                .map((r) => `- ${r.date} ${r.time} (${r.mealStatus}): ${r.level}`)
                .join("\n") || "기록 없음"
            }

      요청 사항:
      1. 현재 혈압과 혈당 수치에 대한 전반적인 평가를 해주세요.
      2. 주의해야 할 점이나 위험 신호가 있다면 알려주세요.
      3. 이 사용자에게 가장 필요한 식단(구체적인 음식 예시 포함)과 운동 가이드를 3가지씩 제안해주세요.
      4. 격려의 말로 마무리해주세요.
      5. 답변은 Markdown 형식으로 깔끔하게 정리해주세요. (헤더 사용 등)
      
      주의: 이 조언은 의료 전문가의 진단을 대신할 수 없음을 명시해주세요.
    `;

        const result = await callGeminiAPI(prompt);
        setLoading(false);
        if (
            result.startsWith("AI 서비스 연결 중 오류") ||
            result.startsWith("분석 결과를")
        ) {
            setError(result);
        } else {
            setInsight(result);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="p-8 border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30">
                <div className="text-center space-y-4 mb-8">
                    <div className="flex justify-center">
                        <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                            <BrainCircuit size={32} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">AI 건강 코치 ✨</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        최근 기록된 혈압과 혈당 데이터를 분석하여
                        <br />
                        현재 상태에 딱 맞는 맞춤형 건강 가이드를 받아보세요.
                    </p>
                    <Button
                        onClick={handleGenerateInsight}
                        disabled={loading}
                        variant="ai"
                        className="w-full sm:w-auto px-8 py-3 text-lg shadow-indigo-200"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <RefreshCw className="animate-spin" size={20} /> 분석
                                중입니다...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Sparkles size={20} /> 지금 바로 분석받기
                            </span>
                        )}
                    </Button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                {insight && (
                    <div className="mt-8 animate-fade-in">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm prose prose-sm sm:prose max-w-none">
                            <div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold border-b border-indigo-100 pb-2">
                                <MessageSquare size={20} />
                                <span>AI 분석 리포트</span>
                            </div>
                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                {insight}
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                                * 본 분석 결과는 참고용이며, 정확한 진단과 처방은 반드시 의사와
                                상담하시기 바랍니다.
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default AIInsightSection;
