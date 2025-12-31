/**
 * 참가국 정보 스쿼드 빌더 페이지
 *
 * 용도: 특정 국가의 스쿼드를 이미지로 표시
 */

"use client";

import { useState } from "react";
import ImageSquadBuilder, { Formation, PlayerWithImage } from "@/components/squad/ImageSquadBuilder";
import { convertToPlayerWithImage } from "@/components/squad/utils/squadUtils";

// 더미 데이터 예시
const countryPlayers: PlayerWithImage[] = [
  { id: 1, name: "게예르모 오초아", position: "GK", imageUrl: "https://i.ifh.cc/qbhPHD.png" },
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

export default function CountrySquadPage() {
  const [formation, setFormation] = useState<Formation>("4-3-3");
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithImage | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">참가국 정보 스쿼드 빌더</h1>

        {/* 국가 선택 및 포메이션 선택 */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">국가:</label>
            <select className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm">
              <option value="mexico">멕시코</option>
              <option value="southkorea">대한민국</option>
              <option value="brazil">브라질</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">포메이션:</label>
            <select
              value={formation}
              onChange={(e) => setFormation(e.target.value as Formation)}
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
            players={countryPlayers}
            formation={formation}
            onPlayerClick={(player, index) => {
              const convertedPlayer = convertToPlayerWithImage(player);
              setSelectedPlayer(convertedPlayer);
            }}
          />
        </div>

        {/* 선수 상세 정보 */}
        {selectedPlayer && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">선수 정보</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500">
                <img
                  src={selectedPlayer.imageUrl}
                  alt={selectedPlayer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{selectedPlayer.name}</h3>
                <p className="text-sm text-gray-600">포지션: {selectedPlayer.position}</p>
                <p className="text-sm text-gray-600">ID: {selectedPlayer.id}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPlayer(null)}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              닫기
            </button>
          </div>
        )}

        {/* 사용 안내 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">사용 안내</h2>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 선수 카드를 드래그하여 위치를 변경할 수 있습니다.</li>
            <li>• 선수 카드를 클릭하면 선수 정보를 확인할 수 있습니다.</li>
            <li>• 포메이션을 변경하면 선수들이 자동으로 재배치됩니다.</li>
            <li>• 국가를 선택하면 해당 국가의 선수 명단이 표시됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
