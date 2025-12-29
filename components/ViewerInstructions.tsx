/**
 * ViewerInstructions 컴포넌트
 *
 * 용도: Sketchfab 3D 뷰어 사용 방법을 안내하는 모달 컴포넌트
 * - 마우스, 키보드, 터치 조작 방법 설명
 * - 모달 열림 시 배경 스크롤 잠금
 *
 * 사용 위치:
 * - StadiumViewer: 3D 뷰어 상단에 "3D 뷰어 사용 방법" 버튼으로 표시
 */

"use client";

import { useState, useEffect } from "react";

export default function ViewerInstructions() {
  // 모달 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);

  /**
   * 모달 열림/닫힘 시 배경 스크롤 제어
   * - 모달이 열리면 배경 스크롤 잠금
   * - 모달이 닫히면 스크롤 위치 복원
   */
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;

      // 배경 스크롤 잠금
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // 스크롤 복원
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    // cleanup: 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      if (isOpen) {
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || "0") * -1);
        }
      }
    };
  }, [isOpen]);

  return (
    <>
      {/* 사용 방법 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        aria-label="3D 뷰어 사용 방법 보기"
      >
        📖 3D 뷰어 사용 방법
      </button>

      {/* 사용 방법 모달 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            // 배경 클릭 시 모달 닫기
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* 헤더 */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  3D 경기장 뷰어 사용 방법
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  aria-label="모달 닫기"
                >
                  ×
                </button>
              </div>

              {/* 사용 방법 내용 */}
              <div className="space-y-6">
                {/* 마우스 조작 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    🖱️ 마우스 조작
                  </h3>
                  <ul className="space-y-2 text-gray-700 ml-4">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">• 좌클릭 + 드래그:</span>
                      <span>경기장 회전</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">• Shift + 좌클릭 + 드래그:</span>
                      <span>경기장 이동 (팬)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">• 마우스 휠:</span>
                      <span>확대/축소</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">• 우클릭 + 드래그:</span>
                      <span>경기장 이동 (팬)</span>
                    </li>
                  </ul>
                </div>

                {/* 키보드 조작 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    ⌨️ 키보드 조작
                  </h3>
                  <ul className="space-y-2 text-gray-700 ml-4">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">• R:</span>
                      <span>뷰 리셋 (원래 위치로 복귀)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">• F:</span>
                      <span>전체 화면 모드</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">• 화살표 키:</span>
                      <span>경기장 회전</span>
                    </li>
                  </ul>
                </div>

                {/* 터치 조작 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    👆 터치 조작 (모바일)
                  </h3>
                  <ul className="space-y-2 text-gray-700 ml-4">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">• 한 손가락 드래그:</span>
                      <span>경기장 회전</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">• 두 손가락 핀치:</span>
                      <span>확대/축소</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">• 두 손가락 드래그:</span>
                      <span>경기장 이동</span>
                    </li>
                  </ul>
                </div>

                {/* 팁 */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>팁:</strong> 뷰어 하단의 컨트롤 버튼을 사용하여 자동 재생,
                    음소거, 풀스크린 등의 추가 기능을 이용할 수 있습니다.
                  </p>
                </div>
              </div>

              {/* 확인 버튼 */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
