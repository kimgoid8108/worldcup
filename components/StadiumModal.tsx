/**
 * StadiumModal 컴포넌트
 *
 * 용도: 경기장 상세 정보를 표시하는 모달 컴포넌트
 * - 경기장 이름, 위치, 설명 표시
 * - 3D 경기장 뷰어(Sketchfab) 임베드
 * - 모달 열림 시 배경 스크롤 잠금
 */

"use client";

import { useEffect } from "react";
import { stadiums } from "@/data/stadiums";
import StadiumViewer from "./StadiumViewer";

interface StadiumModalProps {
  stadiumId: string | null;
  onClose: () => void;
}

export default function StadiumModal({ stadiumId, onClose }: StadiumModalProps) {
  // 경기장 ID로 경기장 정보 조회
  const stadium = stadiumId ? stadiums.find((s) => s.id === stadiumId) : null;

  /**
   * 모달 열림/닫힘 시 배경 스크롤 제어
   * - 모달이 열리면 배경 스크롤 잠금
   * - 모달이 닫히면 스크롤 위치 복원
   * - wheel/touchmove 이벤트로 배경 스크롤 완전 차단
   */
  useEffect(() => {
    if (stadiumId) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;

      // 배경 스크롤 잠금 (body 고정)
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      /**
       * 배경 스크롤 완전 차단 함수
       * 모달 내부(.modal-content)가 아닌 영역의 스크롤을 차단
       */
      const preventScroll = (e: WheelEvent | TouchEvent) => {
        const target = e.target as HTMLElement;
        const modalContent = target.closest('.modal-content');

        // 모달 내부가 아닌 경우 스크롤 차단
        if (!modalContent || !modalContent.contains(target)) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      // 전역 스크롤 이벤트 리스너 추가
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });

      // cleanup: 모달 닫힐 때 이벤트 리스너 제거 및 스크롤 복원
      return () => {
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);

        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";

        // 스크롤 위치 복원
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || "0") * -1);
        }
      };
    } else {
      // 모달이 닫힌 경우 스크롤 복원
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
  }, [stadiumId]);

  // 경기장 정보가 없으면 모달 표시 안 함
  if (!stadium) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={(e) => {
        // 배경 클릭 시 모달 닫기
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* 모달 컨테이너 (스크롤 가능) */}
      <div className="modal-content bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 헤더: 경기장 이름 및 닫기 버튼 */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                {stadium.name}
              </h2>
              <p className="text-gray-600">
                {stadium.city}, {stadium.country}
              </p>
              <p className="text-sm text-blue-600 font-semibold mt-1">
                수용 인원: {stadium.capacity.toLocaleString()}명
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl font-bold w-10 h-10 flex items-center justify-center"
              aria-label="모달 닫기"
            >
              ×
            </button>
          </div>

          {/* 경기장 설명 */}
          <p className="text-gray-700 mb-6">{stadium.description}</p>

          {/* 3D 경기장 뷰어 섹션 */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              3D 경기장 뷰어
            </h3>
            <StadiumViewer modelId={stadium.sketchfabModelId} author={stadium.author} />
          </div>
        </div>
      </div>
    </div>
  );
}
