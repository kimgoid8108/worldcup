import { notFound } from 'next/navigation';
import Link from 'next/link';
import { stadiums } from '@/data/stadiums';
import StadiumViewer from '@/components/ui/StadiumViewer';

interface PageProps {
  params: {
    id: string;
  };
}

export default function StadiumDetailPage({ params }: PageProps) {
  const stadium = stadiums.find((s) => s.id === params.id);

  if (!stadium) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-block mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← 목록으로 돌아가기
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            {stadium.name}
          </h1>

          <div className="mb-6">
            <p className="text-xl text-gray-600 mb-2">
              {stadium.city}, {stadium.country}
            </p>
            <p className="text-gray-700">{stadium.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              3D 경기장 뷰어
            </h2>
            <StadiumViewer modelId={stadium.sketchfabModelId} author={stadium.author} />
          </div>
        </div>
      </div>
    </main>
  );
}
