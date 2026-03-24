import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getIdea, updateIdea } from '../../../lib/api';

const inputBaseClasses =
  'w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100';
const textAreaBaseClasses = `${inputBaseClasses} min-h-[120px] resize-none`;

function FieldLabel({ title, optional }) {
  return (
    <label className="mb-2 block text-sm font-semibold text-slate-900">
      {title}{' '}
      <span className="text-xs font-normal text-slate-500">
        {optional ? '(opcional)' : '(obrigatório)'}
      </span>
    </label>
  );
}

export default function EditIdea() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idea, setIdea] = useState(null);
  const [form, setForm] = useState({
    what_to_improve: '',
    current_process: '',
    proposed_solution: '',
    benefit: '',
  });

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const data = await getIdea(id);
        setIdea(data);
        if (data && !data.error) {
          setForm({
            what_to_improve: data.what_to_improve ?? '',
            current_process: data.current_process ?? '',
            proposed_solution: data.proposed_solution ?? '',
            benefit: data.benefit ?? '',
          });
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || idea?.is_locked) return;

    setIsSubmitting(true);
    try {
      const payload = {
        what_to_improve: form.what_to_improve,
        current_process: form.current_process,
        proposed_solution: form.proposed_solution,
        benefit: form.benefit,
      };
      const res = await updateIdea(id, payload);
      if (res?.error) {
        alert(res.error);
        return;
      }
      router.push(`/ideas/${id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-slate-600">Carregando...</p>
        </div>
      </main>
    );
  }

  if (!idea || idea.error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-slate-600">Ideia não encontrada.</p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Voltar para lista
          </Link>
        </div>
      </main>
    );
  }

  const locked = Boolean(idea.is_locked);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Atualizar ideia</h1>
            <p className="mt-2 text-sm text-slate-500">
              Edite os campos abaixo e salve para enviar as alterações ao servidor.
            </p>
          </div>
          <Link
            href={`/ideas/${id}`}
            className="inline-flex w-fit items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Ver detalhes
          </Link>
        </div>

        {locked && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            Esta ideia está bloqueada (já classificada). A edição não está disponível.
          </div>
        )}

        <form className="mt-7 space-y-6" onSubmit={handleSubmit}>
          <section>
            <FieldLabel title="O que pode ser melhorado" />
            <textarea
              required
              name="what_to_improve"
              value={form.what_to_improve}
              onChange={handleChange}
              disabled={locked}
              className={`${textAreaBaseClasses} min-h-[135px] ${locked ? 'cursor-not-allowed bg-slate-100 text-slate-500' : ''}`}
              placeholder="Descreva o problema ou a oportunidade com o máximo de detalhes possível."
            />
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel title="Como é feito hoje" optional />
              <textarea
                name="current_process"
                value={form.current_process}
                onChange={handleChange}
                disabled={locked}
                className={`${textAreaBaseClasses} ${locked ? 'cursor-not-allowed bg-slate-100 text-slate-500' : ''}`}
                placeholder="Etapas, ferramentas ou fluxos de trabalho atuais"
              />
            </div>

            <div>
              <FieldLabel title="Como pode ser melhorado" optional />
              <textarea
                name="proposed_solution"
                value={form.proposed_solution}
                onChange={handleChange}
                disabled={locked}
                className={`${textAreaBaseClasses} ${locked ? 'cursor-not-allowed bg-slate-100 text-slate-500' : ''}`}
                placeholder="Alterações sugeridas ou abordagens alternativas"
              />
            </div>
          </section>

          <section>
            <FieldLabel title="Qual é o benefício" optional />
            <textarea
              name="benefit"
              value={form.benefit}
              onChange={handleChange}
              disabled={locked}
              className={`${textAreaBaseClasses} ${locked ? 'cursor-not-allowed bg-slate-100 text-slate-500' : ''}`}
              placeholder="Ganhos esperados, como economia de tempo ou redução de custos."
            />
          </section>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              onClick={() => router.push('/')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || locked}
              className="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
