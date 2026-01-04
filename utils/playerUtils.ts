import { type Player } from "@/types/player";

/**
 * 언어에 따라 선수 이름 반환
 *
 * @param player - Player 객체
 * @param language - 언어 ("ko" | "en")
 * @returns 언어에 맞는 선수명
 */
export const getPlayerNameByLanguage = (player: Player | null | undefined, language: "ko" | "en"): string => {
  if (!player) return "";
  if (language === "en" && player.nameEn) {
    return player.nameEn;
  }
  return player.name;
};

