/**
 * ModalHeader 컴포넌트
 *
 * 용도: 모달 헤더를 표시하는 재사용 가능한 컴포넌트
 */

"use client";

import { ReactNode } from "react";

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
}

export default function ModalHeader({
  title,
  subtitle,
  onClose,
  children,
  className = "",
}: ModalHeaderProps) {
  return (
    <div className={`flex justify-between items-center mb-4 ${className}`}>
      <div className="flex items-center gap-4">
        {children}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 text-3xl font-bold w-10 h-10 flex items-center justify-center"
        aria-label="모달 닫기"
      >
        ×
      </button>
    </div>
  );
}

