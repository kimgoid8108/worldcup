/**
 * 경기일정 스쿼드 빌더 페이지
 *
 * 용도: 경기 일정에 따른 두 팀의 스쿼드를 이미지로 표시
 */

"use client";

import { useState } from "react";
import ImageSquadBuilder, { Formation, PlayerWithImage } from "@/components/squad/ImageSquadBuilder";

// 더미 데이터 예시
const team1Players: PlayerWithImage[] = [
  { id: 1, name: "게예르모", position: "GK", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 2, name: "에드손 알바레스", position: "MF", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 3, name: "히르빙 로사노", position: "FW", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 4, name: "라울 히메네스", position: "FW", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 5, name: "헤수스 코로나", position: "FW", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 6, name: "안드레스 과르다도", position: "MF", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 7, name: "엑토르 모레노", position: "DF", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 8, name: "카를로스 살세도", position: "DF", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 9, name: "세사르 몬테스", position: "DF", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 10, name: "헤수스 가야르도", position: "DF", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 11, name: "루이스 차베스", position: "MF", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
];

const team2Players: PlayerWithImage[] = [
  { id: 1, name: "론윈 윌리엄스", position: "GK", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 2, name: "시부시소 음코와네", position: "DF", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 3, name: "그랜트 케카나", position: "DF", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 4, name: "아우브레 모디바", position: "DF", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 5, name: "테보호 모코에나", position: "DF", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 6, name: "테비조 마셀라", position: "MF", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 7, name: "스파헬레 음시", position: "MF", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 8, name: "페르시 타우", position: "MF", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 9, name: "이크람 아마드", position: "FW", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 10, name: "자크 모디세", position: "FW", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
  { id: 11, name: "테보호 모코에나", position: "FW", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
];

export default function MatchSquadPage() {
  const [team1Formation, setTeam1Formation] = useState<Formation>("4-3-3");
  const [team2Formation, setTeam2Formation] = useState<Formation>("4-3-3");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">경기일정 스쿼드 빌더</h1>

        {/* 포메이션 선택 */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">팀1 포메이션:</label>
            <select
              value={team1Formation}
              onChange={(e) => setTeam1Formation(e.target.value as Formation)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
            >
              <option value="4-3-3">4-3-3</option>
              <option value="4-4-2">4-4-2</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">팀2 포메이션:</label>
            <select
              value={team2Formation}
              onChange={(e) => setTeam2Formation(e.target.value as Formation)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
            >
              <option value="4-3-3">4-3-3</option>
              <option value="4-4-2">4-4-2</option>
            </select>
          </div>
        </div>

        {/* 스쿼드 빌더 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ImageSquadBuilder
            players={team1Players}
            formation={team1Formation}
            team2Players={team2Players}
            team2Formation={team2Formation}
            onPlayerClick={(player, index) => {
              if (player) {
                console.log("팀1 선수 클릭:", player);
              }
            }}
            onTeam2PlayerClick={(player, index) => {
              if (player) {
                console.log("팀2 선수 클릭:", player);
              }
            }}
          />
        </div>

        {/* 사용 안내 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">사용 안내</h2>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 선수 카드를 드래그하여 위치를 변경할 수 있습니다.</li>
            <li>• 선수 카드를 클릭하면 선수 정보를 확인할 수 있습니다.</li>
            <li>• 포메이션을 변경하면 선수들이 자동으로 재배치됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
