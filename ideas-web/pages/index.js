import { useEffect, useState } from 'react';
import { getIdeas } from '../lib/api';
import Link from 'next/link';

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIdeas() {
      try {
        const data = await getIdeas();
        setIdeas(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }
    loadIdeas();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Lista de Ideias</h1>
            <p className="mt-2 text-sm text-slate-500">
              Acompanhe ideias enviadas e abra detalhes para classificação.
            </p>
          </div>

          <Link
            href="/ideas/create"
            className="inline-flex items-center justify-center rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
          >
            Criar nova ideia
          </Link>
        </div>

        <div className="mt-7">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
              Carregando ideias...
            </div>
          ) : ideas.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
              Nenhuma ideia encontrada no momento.
            </div>
          ) : (
            <ul className="space-y-3">
              {ideas.map((idea) => (
                <li
                  key={idea.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-300"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {idea.what_to_improve || 'Sem título'}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600">
                        Status:{' '}
                        <span className="font-medium text-slate-800">{idea.status || 'PENDENTE'}</span>
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Bloqueada:{' '}
                        <span className="font-medium text-slate-800">
                          {idea.is_locked ? 'Sim' : 'Não'}
                        </span>
                      </p>
                    </div>

                    <Link
                      href={`/ideas/${idea.id}`}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}