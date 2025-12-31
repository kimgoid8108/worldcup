/**
 * PitchLines 컴포넌트
 * 축구장 라인을 렌더링하는 컴포넌트
 */

import { memo } from "react";

interface PitchLinesProps {
  isTwoTeamMode: boolean;
}

const PitchLines = memo(({ isTwoTeamMode }: PitchLinesProps) => {
  if (isTwoTeamMode) {
    return (
      <>
        <ellipse
          cx="50%"
          cy="50%"
          rx="8%"
          ry="20%"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.8"
        />
        <circle cx="50%" cy="50%" r="2" fill="white" opacity="0.8" />
        <rect
          x="0%"
          y="20%"
          width="18%"
          height="60%"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.8"
        />
        <rect
          x="0%"
          y="35%"
          width="6%"
          height="30%"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.8"
        />
        <rect
          x="82%"
          y="20%"
          width="18%"
          height="60%"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.8"
        />
        <rect
          x="94%"
          y="35%"
          width="6%"
          height="30%"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.8"
        />
        <line
          x1="50%"
          y1="0%"
          x2="50%"
          y2="100%"
          stroke="white"
          strokeWidth="3"
          opacity="0.9"
        />
      </>
    );
  }

  return (
    <>
      <circle
        cx="50%"
        cy="50%"
        r="15%"
        fill="none"
        stroke="white"
        strokeWidth="2"
        opacity="0.8"
      />
      <circle cx="50%" cy="50%" r="2" fill="white" opacity="0.8" />
      {/* 왼쪽 골대 (왼쪽 끝, 위쪽 중앙) - 경기장 상단 */}
      <rect
        x="0%"
        y="5%"
        width="18%"
        height="20%"
        fill="none"
        stroke="white"
        strokeWidth="2"
        opacity="0.8"
      />
      {/* 왼쪽 골 에어리어 */}
      <rect
        x="0%"
        y="10%"
        width="6%"
        height="10%"
        fill="none"
        stroke="white"
        strokeWidth="2"
        opacity="0.8"
      />
      {/* 오른쪽 골대 (오른쪽 끝, 아래쪽 중앙) - 경기장 하단 */}
      <rect
        x="82%"
        y="75%"
        width="18%"
        height="20%"
        fill="none"
        stroke="white"
        strokeWidth="2"
        opacity="0.8"
      />
      {/* 오른쪽 골 에어리어 */}
      <rect
        x="94%"
        y="80%"
        width="6%"
        height="10%"
        fill="none"
        stroke="white"
        strokeWidth="2"
        opacity="0.8"
      />
      <line
        x1="0%"
        y1="50%"
        x2="100%"
        y2="50%"
        stroke="white"
        strokeWidth="2"
        opacity="0.8"
      />
    </>
  );
});

PitchLines.displayName = "PitchLines";

export default PitchLines;
