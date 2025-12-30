/**
 * PlayerModal 컴포넌트
 *
 * 용도: 선수 상세 정보를 표시하는 모달 컴포넌트
 * - 선수 이름, 포지션, 나이, 소속 클럽 표시
 * - 선수 이미지 표시
 * - 모달 열림 시 배경 스크롤 잠금
 */

"use client";

import { useEffect, useMemo, useCallback } from "react";
import { Player } from "@/data/players";

interface PlayerModalProps {
  player: Player | null;
  countryName?: string; // 국가 이름 (선택사항)
  onClose: () => void;
}

// 포지션 한글 변환 맵 (컴포넌트 외부로 이동하여 재생성 방지)
const POSITION_MAP: Record<string, string> = {
  GK: "골키퍼",
  DF: "수비수",
  MF: "미드필더",
  FW: "공격수",
};

// 스크롤 복원 헬퍼 함수
const restoreScroll = () => {
  const scrollY = document.body.style.top;
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
  }
};

export default function PlayerModal({ player, countryName, onClose }: PlayerModalProps) {
  /**
   * ESC 키로 모달 닫기
   * PlayerModal은 최상위 모달이므로 capture phase에서 먼저 처리
   */
  useEffect(() => {
    if (!player) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    // capture phase에서 이벤트를 먼저 처리하여 하위 모달의 핸들러가 실행되지 않도록 함
    window.addEventListener("keydown", handleEscape, true);
    return () => {
      window.removeEventListener("keydown", handleEscape, true);
    };
  }, [player, onClose]);

  /**
   * 모달 열림/닫힘 시 배경 스크롤 제어
   * CountryModal이 이미 열려있을 때는 스크롤 잠금을 추가로 적용하지 않음
   * PlayerModal은 CountryModal 위에 표시되므로 스크롤 제어는 CountryModal에 맡김
   */
  useEffect(() => {
    if (!player) return;

    // CountryModal이 열려있는지 확인 (z-40 클래스를 가진 요소 확인)
    const isCountryModalOpen = document.querySelector('.fixed.inset-0.z-40') !== null;
    
    // CountryModal이 열려있지 않은 경우에만 스크롤 제어
    if (!isCountryModalOpen) {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = `-${scrollX}px`;
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      // PlayerModal이 닫힐 때, CountryModal이 여전히 열려있는지 확인
      const isCountryModalStillOpen = document.querySelector('.fixed.inset-0.z-40') !== null;
      
      // CountryModal이 열려있지 않은 경우에만 스크롤 복원
      if (!isCountryModalStillOpen) {
        restoreScroll();
      }
    };
  }, [player]);

  // 포지션 한글 변환 메모이제이션 (hooks는 항상 같은 순서로 호출되어야 함)
  const positionName = useMemo(() => player ? (POSITION_MAP[player.position] || player.position) : '', [player]);

  // 배경 클릭 핸들러 메모이제이션 (hooks는 early return 이전에 호출되어야 함)
  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // 선수 정보가 없으면 모달 표시 안 함 (모든 hooks 호출 후 early return)
  if (!player) return null;

  return (
    <div
      className="fixed inset-0 z-[45] flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        pointerEvents: 'auto',
      }}
      onClick={handleBackdropClick}
    >
      {/* 모달 컨테이너 */}
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-blue-400" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 46 }}>
        <div className="p-6">
          {/* 헤더: 닫기 버튼 */}
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl font-bold w-10 h-10 flex items-center justify-center"
              aria-label="모달 닫기"
            >
              ×
            </button>
          </div>

          {/* 선수 정보 */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* 선수 이미지 */}
            {player.imageUrl && (
              <div className="flex-shrink-0">
                <img
                  src={player.imageUrl}
                  alt={player.name}
                  className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    // 이미지 로드 실패 시 숨김
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}

            {/* 선수 정보 텍스트 */}
            <div className="flex-1 text-center md:text-left">
              {countryName && (
                <p className="text-sm text-gray-600 mb-2">{countryName}</p>
              )}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {player.name}
              </h2>
              {player.nameEn && (
                <p className="text-xl md:text-2xl text-gray-600 mb-4">
                  {player.nameEn}
                </p>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="text-gray-600 font-medium">포지션:</span>
                  <span className="text-gray-800 font-semibold">
                    {positionName} ({player.position})
                  </span>
                </div>

                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="text-gray-600 font-medium">나이:</span>
                  <span className="text-gray-800 font-semibold">{player.age}세</span>
                </div>

                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="text-gray-600 font-medium">소속 클럽:</span>
                  <span className="text-gray-800 font-semibold">{player.club}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
