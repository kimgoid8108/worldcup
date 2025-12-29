/**
 * StadiumViewer 컴포넌트
 *
 * 용도: Sketchfab 3D 경기장 모델을 임베드하는 컴포넌트
 * - Sketchfab iframe을 사용하여 3D 모델 표시
 * - 3D 뷰어 사용 방법 안내 모달 제공
 * - 모델 출처 및 제작자 정보 표시
 */

"use client";

import { useEffect, useRef } from "react";
import ViewerInstructions from "./ViewerInstructions";

interface StadiumViewerProps {
  modelId: string; // Sketchfab 모델 ID
  author?: string; // 모델 제작자 이름
  className?: string; // 추가 CSS 클래스
}

export default function StadiumViewer({
  modelId,
  author,
  className = "",
}: StadiumViewerProps) {
  // iframe 참조
  const iframeRef = useRef<HTMLIFrameElement>(null);

  /**
   * Sketchfab 모델 URL 설정
   * modelId가 변경될 때마다 iframe src 업데이트
   */
  useEffect(() => {
    if (iframeRef.current) {
      // Sketchfab 임베드 URL 생성
      // autostart=0: 자동 재생 비활성화
      // transparent=1: 투명 배경
      // ui_theme=dark: 다크 테마
      iframeRef.current.src = `https://sketchfab.com/models/${modelId}/embed?autostart=0&transparent=1&ui_theme=dark`;
    }
  }, [modelId]);

  return (
    <div className={`w-full ${className}`}>
      {/* 3D 뷰어 사용 방법 안내 버튼 */}
      <ViewerInstructions />

      {/* Sketchfab 3D 모델 iframe */}
      <iframe
        ref={iframeRef}
        title="3D Stadium Viewer"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        className="w-full h-[600px] rounded-lg shadow-lg"
        style={{ border: "none" }}
      />

      {/* 모델 출처 및 제작자 정보 */}
      <div className="mt-3 text-center text-sm text-gray-600">
        <p>
          3D 모델 출처:{" "}
          <a
            href={`https://sketchfab.com/models/${modelId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Sketchfab
          </a>
          {author && (
            <>
              {" "}
              | 제작자: <span className="font-medium">{author}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
