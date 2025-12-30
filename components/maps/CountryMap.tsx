/**
 * CountryMap 컴포넌트
 *
 * 용도: 국가 위치를 Google Maps로 표시하는 재사용 가능한 컴포넌트
 */

"use client";

interface CountryMapProps {
  latitude: number;
  longitude: number;
  countryName: string;
  zoom?: number;
  className?: string;
}

export default function CountryMap({
  latitude,
  longitude,
  countryName,
  zoom = 10,
  className = "",
}: CountryMapProps) {
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed&zoom=${zoom}`;

  return (
    <div className={`w-full h-64 rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
        title={`${countryName} 위치 지도`}
      />
    </div>
  );
}

