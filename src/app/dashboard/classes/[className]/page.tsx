'use client';

import { Book, Calculator, Leaf, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const subjects = [
  {
    name: 'English',
    icon: <Book className="h-8 w-8 text-blue-500" />,
  },
  {
    name: 'Mathematics',
    icon: <Calculator className="h-8 w-8 text-blue-500" />,
  },
  {
    name: 'EVS',
    icon: <Leaf className="h-8 w-8 text-blue-500" />,
  },
];

export default function ClassNamePage({
  params,
}: {
  params: { className: string };
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold capitalize">
          {decodeURIComponent(params.className.replace('-', ' '))}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
          Choose a subject to continue learning
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 mt-12">
        {subjects.map((subject) => (
          <Link
            href={`/dashboard/subjects/${subject.name.toLowerCase()}`}
            key={subject.name}
            className="no-underline"
          >
            <div className="flex flex-col items-center justify-center w-56 h-40 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700">
              {subject.icon}
              <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">{subject.name}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center text-gray-500 dark:text-gray-400">
        <p>"Learning is a journey of discovery. Choose your path and explore!"</p>
      </div>
    </div>
  );
}
