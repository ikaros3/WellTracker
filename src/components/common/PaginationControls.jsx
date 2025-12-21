import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-4 mt-4 py-2 border-t border-gray-100">
            <Button
                variant="ghost"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2"
            >
                <ChevronLeft size={20} />
            </Button>
            <span className="text-sm font-medium text-gray-700">
                {currentPage} / {totalPages}
            </span>
            <Button
                variant="ghost"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2"
            >
                <ChevronRight size={20} />
            </Button>
        </div>
    );
};

export default PaginationControls;
