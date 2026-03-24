import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getIdea, getClassification, classifyIdea, updateIdea } from '../../lib/api';

const inputClasses =
  'w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100';

export default function IdeaDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [idea, setIdea] = useState(null);
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(true);

  const [classForm, setClassForm] = useState({
    result: 'IMPLANTADA',
    re_responsible: '',
    final_comment: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    what_to_improve: '',
    current_process: '',
    proposed_solution: '',
    benefit: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const canEditIdea = idea?.status === 'EM_AVALIACAO';

  useEffect(() => {
    setEditMode(false);
  }, [id]);

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      const ideaData = await getIdea(id);
      setIdea(ideaData);

      const classData = await getClassification(id).catch(() => null);
      setClassification(classData);

      setLoading(false);
    }

    loadData();
  }, [id]);

  useEffect(() => {
    if (!idea) return;
    setEditForm({
      what_to_improve: idea.what_to_improve ?? '',
      current_process: idea.current_process ?? '',
      proposed_solution: idea.proposed_solution ?? '',
      benefit: idea.benefit ?? '',
    });
  }, [idea]);

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openEditMode = () => {
    setEditForm({
      what_to_improve: idea.what_to_improve ?? '',
      current_process: idea.current_process ?? '',
      proposed_solution: idea.proposed_solution ?? '',
      benefit: idea.benefit ?? '',
    });
    setEditMode(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!canEditIdea) return;

    setSavingEdit(true);
    try {
      const res = await updateIdea(id, {
        what_to_improve: editForm.what_to_improve,
        current_process: editForm.current_process,
        proposed_solution: editForm.proposed_solution,
        benefit: editForm.benefit,
      });

      if (res.error) {
        alert(res.error);
        return;
      }

      setIdea(res);
      setEditMode(false);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleClassChange = (e) => {
    setClassForm({ ...classForm, [e.target.name]: e.target.value });
  };

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    const res = await classifyIdea(id, classForm);

    if (res.error) {
      alert(res.error);
    } else {
      setClassification(res);
      setIdea({ ...idea, status: res.result, is_locked: true });
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

  if (!idea) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-slate-600">Ideia não encontrada.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Detalhes da Ideia</h1>
            <p className="mt-2 text-sm text-slate-500">
              Visualize os dados enviados e conclua a classificação quando necessário.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {canEditIdea && !editMode && (
              <button
                type="button"
                onClick={openEditMode}
                className="inline-flex w-fit items-center justify-center rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
              >
                Atualizar ideia
              </button>
            )}
            {canEditIdea && editMode && (
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="inline-flex w-fit items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Cancelar edição
              </button>
            )}
            <button
              type="button"
              onClick={() => router.push('/')}
              className="inline-flex w-fit items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Voltar para lista
            </button>
          </div>
        </div>

        {!canEditIdea && (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            A edição dos campos da ideia só é permitida quando o status for{' '}
            <span className="font-semibold">EM_AVALIACAO</span>.
          </p>
        )}

        {editMode && canEditIdea ? (
          <form onSubmit={handleEditSubmit} className="mt-7 space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Status:</span> {idea.status}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Bloqueada:</span>{' '}
                  {idea.is_locked ? 'Sim' : 'Não'}
                </p>
              </div>
            </section>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                O que pode ser melhorado
              </label>
              <textarea
                name="what_to_improve"
                value={editForm.what_to_improve}
                onChange={handleEditChange}
                required
                className={`${inputClasses} min-h-[120px] resize-none py-4`}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900">
                  Como é feito hoje
                </label>
                <textarea
                  name="current_process"
                  value={editForm.current_process}
                  onChange={handleEditChange}
                  className={`${inputClasses} min-h-[110px] resize-none py-4`}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900">
                  Como pode ser melhorado
                </label>
                <textarea
                  name="proposed_solution"
                  value={editForm.proposed_solution}
                  onChange={handleEditChange}
                  className={`${inputClasses} min-h-[110px] resize-none py-4`}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                Qual é o benefício
              </label>
              <textarea
                name="benefit"
                value={editForm.benefit}
                onChange={handleEditChange}
                className={`${inputClasses} min-h-[110px] resize-none py-4`}
              />
            </div>

            <button
              type="submit"
              disabled={savingEdit}
              className="inline-flex items-center justify-center rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {savingEdit ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </form>
        ) : (
          <>
            <section className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-semibold text-slate-900">{idea.what_to_improve}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Status:</span> {idea.status}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Bloqueada:</span>{' '}
                  {idea.is_locked ? 'Sim' : 'Não'}
                </p>
              </div>
            </section>

            <section className="mt-5 grid gap-4">
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold tracking-wide text-slate-500">
                  Como é feito hoje
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {idea.current_process || '-'}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold tracking-wide text-slate-500">
                  Como pode ser melhorado
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {idea.proposed_solution || '-'}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold tracking-wide text-slate-500">
                  Benefício esperado
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {idea.benefit || '-'}
                </p>
              </article>
            </section>
          </>
        )}

        <section className="mt-7 border-t border-slate-100 pt-6">
          {classification ? (
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
              <h3 className="text-lg font-semibold text-violet-900">Classificacao</h3>
              <p className="mt-3 text-sm text-violet-900">
                <span className="font-semibold">Resultado:</span> {classification.result}
              </p>
              <p className="mt-1 text-sm text-violet-900">
                <span className="font-semibold">Responsavel:</span>{' '}
                {classification.re_responsible}
              </p>
              <p className="mt-1 text-sm text-violet-900">
                <span className="font-semibold">Comentario final:</span>{' '}
                {classification.final_comment}
              </p>
            </div>
          ) : idea.is_locked ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
              Ideia ja esta classificada.
            </p>
          ) : (
            <form onSubmit={handleClassSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Classificar ideia</h3>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Responsavel</label>
                <input
                  name="re_responsible"
                  value={classForm.re_responsible}
                  onChange={handleClassChange}
                  required
                  className={inputClasses}
                  placeholder="Nome de quem avaliou"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Comentario final
                </label>
                <textarea
                  name="final_comment"
                  value={classForm.final_comment}
                  onChange={handleClassChange}
                  required
                  className={`${inputClasses} min-h-[110px] resize-none py-4`}
                  placeholder="Descreva a decisao e contexto"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
              >
                Classificar
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}