/**
 * Flag 컴포넌트
 *
 * 용도: 국가 국기를 이미지로 렌더링하는 범용 컴포넌트
 * - flagImageUrl이 있으면 사용, 없으면 국가 코드로 자동 생성
 * - flagcdn.com 규칙 준수: https, ISO 3166-1 alpha-2 소문자, .png
 * - 모든 환경에서 일관되게 이미지로 표시
 *
 * 사용 위치:
 * - PotsTab, GroupsTab, CountryModal, PotInfo 등 모든 컴포넌트
 */

import { useState } from "react";
import { Country } from "@/data/countries";

// Flag 컴포넌트에서 사용하는 Country 타입 (teamId는 선택적)
type FlagCountry = Omit<Country, "teamId"> & { teamId?: number };

interface FlagProps {
  country: FlagCountry;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

// 이미지용 크기 클래스 및 명시적 크기 (너비/높이 포함)
const imageSizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
  xl: "w-16 h-16",
};

const imageSizes = {
  sm: { width: 24, height: 24 },
  md: { width: 32, height: 32 },
  lg: { width: 40, height: 40 },
  xl: { width: 64, height: 64 },
};

/**
 * ISO 3166-1 alpha-3 (3자리) 코드를 alpha-2 (2자리) 코드로 변환
 * flagcdn.com 규칙: https://flagcdn.com/w40/{alpha-2 소문자}.png
 *
 * 잉글랜드(ENG), 스코틀랜드(SCO) 등 flagcdn에 없는 국가는 null 반환
 */
function getFlagCdnCode(code: string): string | null {
  // flagcdn에 존재하지 않는 국가 (별도 SVG URL 사용)
  const notInFlagCdn = ["ENG", "SCO", "NIR", "WAL", "XKX"]; // 잉글랜드, 스코틀랜드, 북아일랜드, 웨일스, 코소보
  if (notInFlagCdn.includes(code)) {
    return null;
  }

  // ISO 3166-1 alpha-3 -> alpha-2 변환 맵
  const codeMap: Record<string, string> = {
    USA: "us",
    CAN: "ca",
    MEX: "mx",
    BRA: "br",
    ARG: "ar",
    FRA: "fr",
    ESP: "es",
    GER: "de",
    ITA: "it",
    POR: "pt",
    NED: "nl",
    JPN: "jp",
    KOR: "kr",
    MAR: "ma",
    SEN: "sn",
    EGY: "eg",
    AUS: "au",
    URU: "uy",
    COL: "co",
    CHI: "cl",
    PER: "pe",
    ECU: "ec",
    CRO: "hr",
    BEL: "be",
    SUI: "ch",
    DEN: "dk",
    POL: "pl",
    SWE: "se",
    NOR: "no",
    RUS: "ru",
    TUR: "tr",
    IRN: "ir",
    KSA: "sa",
    QAT: "qa",
    UAE: "ae",
    CHN: "cn",
    IND: "in",
    THA: "th",
    VIE: "vn",
    NZL: "nz",
    CRC: "cr",
    PAN: "pa",
    JAM: "jm",
    RSA: "za",
    HAI: "ht",
    PAR: "py",
    CUW: "cw",
    CIV: "ci",
    TUN: "tn",
    DZA: "dz",
    AUT: "at",
    JOR: "jo",
    UZB: "uz",
    GHA: "gh",
    CPV: "cv",
    // 플레이오프 참가국 추가
    MKD: "mk", // 북마케도니아
    CZE: "cz", // 체코
    IRL: "ie", // 아일랜드
    BIH: "ba", // 보스니아 헤르체고비나
    ROU: "ro", // 루마니아
    SVK: "sk", // 슬로바키아
    UKR: "ua", // 우크라이나
    ALB: "al", // 알바니아
    BOL: "bo", // 볼리비아
    SUR: "sr", // 수리남
    IRQ: "iq", // 이라크
    NCL: "nc", // 누벨칼레도니
    COD: "cd", // 콩고민주공화국
  };

  return codeMap[code] || null;
}

/**
 * flagcdn.com 이미지 URL 생성
 * 규칙: https://flagcdn.com/w40/{alpha-2 소문자}.png
 */
function getFlagImageUrl(code: string): string | null {
  const alpha2Code = getFlagCdnCode(code);
  if (!alpha2Code) {
    return null;
  }

  // flagcdn 규칙: https, alpha-2 소문자, .png
  return `https://flagcdn.com/w40/${alpha2Code.toLowerCase()}.png`;
}

export default function Flag({ country, className = "", size = "md" }: FlagProps) {
  // 이미지 URL 생성 (우선순위: flagImageUrl > flagcdn 자동 생성)
  const flagImageUrl = country.flagImageUrl || (country.code ? getFlagImageUrl(country.code) : null);
  const [hasError, setHasError] = useState(false);
  const sizeConfig = imageSizes[size];

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      console.warn(`Failed to load flag image for ${country.nameKo} (${country.code || ""}): ${flagImageUrl}`);
    }
  };

  // flagImageUrl이 없거나 이미지 로드 실패 시 fallback
  if (!flagImageUrl || hasError) {
    return (
      <div
        className={`${imageSizeClasses[size]} ${className} bg-gray-200 rounded flex items-center justify-center`}
        title={`${country.nameKo} 국기 (이미지 로드 실패)`}
        style={{ width: sizeConfig.width, height: sizeConfig.height }}
      >
        <span className="text-xs text-gray-500">{country.code || ""}</span>
      </div>
    );
  }

  return (
    <img
      src={flagImageUrl}
      alt={`${country.nameKo} 국기`}
      width={sizeConfig.width}
      height={sizeConfig.height}
      className={`${imageSizeClasses[size]} object-contain ${className}`}
      loading="lazy"
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onError={handleError}
    />
  );
}
