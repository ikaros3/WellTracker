import React, { useRef } from 'react';
import { Save, RefreshCw, Download, Upload } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const BackupRestoreCard = ({ onExport, onImport, onSave, onLoad }) => {
    const fileInputRef = useRef(null);

    return (
        <Card className="p-6 border-slate-200 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Save className="text-blue-500" size={20} /> 데이터 관리
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    onClick={onSave}
                    variant="outline"
                    className="flex-1 border-blue-600 text-blue-700 hover:bg-blue-50"
                >
                    <Save size={18} /> 저장 (백업)
                </Button>
                <Button
                    onClick={onLoad}
                    variant="outline"
                    className="flex-1 border-slate-400 text-slate-700 hover:bg-slate-50"
                >
                    <RefreshCw size={18} /> 불러오기 (복원)
                </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
                '저장'을 누르면 데이터가 브라우저에 안전하게 저장됩니다.
                <br />
                '불러오기'를 누르면 저장된 데이터를 다시 가져옵니다.
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-600 mb-2">
                    파일로 내보내기 / 가져오기 (JSON)
                </h4>
                <div className="flex gap-3">
                    <Button
                        onClick={onExport}
                        variant="outline"
                        className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 text-xs"
                    >
                        <Download size={14} /> 파일로 저장
                    </Button>
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 text-xs"
                    >
                        <Upload size={14} /> 파일 불러오기
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onImport}
                        accept=".json"
                        className="hidden"
                    />
                </div>
            </div>
        </Card>
    );
};

export default BackupRestoreCard;
