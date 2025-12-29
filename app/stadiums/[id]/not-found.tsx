import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">경기장을 찾을 수 없습니다</h1>
        <p className="text-gray-600 mb-6">요청하신 경기장 정보가 존재하지 않습니다.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
