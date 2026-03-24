import { useState } from 'react';
import { useRouter } from 'next/router';
import { createIdea } from '../../lib/api';

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

export default function CreateIdea() {
  const router = useRouter();
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    re_author: '',
    what_to_improve: '',
    current_process: '',
    proposed_solution: '',
    benefit: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        re_author: isAnonymous ? '' : form.re_author.trim(),
      };

      const created = await createIdea(payload);
      if (created?.id) {
        router.push(`/ideas/${created.id}`);
        return;
      }
      router.push('/');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-semibold text-slate-900">Create New Idea</h1>
        <p className="mt-2 text-sm text-slate-500">
          Capture your idea exactly as you write it - the system records submissions verbatim.
        </p>

        <div className="mt-5 rounded-2xl bg-violet-100 px-5 py-4 text-sm font-medium leading-relaxed text-violet-900">
          Important: All text you enter will be recorded verbatim and shown exactly as submitted
          on the confirmation page and in idea listings. Please avoid including sensitive personal
          data.
        </div>

        <form className="mt-7 space-y-6" onSubmit={handleSubmit}>
          <section>
            <FieldLabel title="O que pode ser melhorado" />
            <textarea
              required
              name="what_to_improve"
              value={form.what_to_improve}
              onChange={handleChange}
              className={`${textAreaBaseClasses} min-h-[135px]`}
              placeholder="Descreva o problema ou a oportunidade com o máximo de detalhes possível."
            />
            <p className="mt-2 text-xs text-slate-500">
                Dica: Seja específico e descreva o problema atual ou o ponto de atrito.
            </p>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel title="Como é feito hoje" optional />
              <textarea
                name="current_process"
                value={form.current_process}
                onChange={handleChange}
                className={textAreaBaseClasses}
                placeholder="Etapas, ferramentas ou fluxos de trabalho atuais"
              />
            </div>

            <div>
              <FieldLabel title="Como pode ser melhorado" optional />
              <textarea
                name="proposed_solution"
                value={form.proposed_solution}
                onChange={handleChange}
                className={textAreaBaseClasses}
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
              className={textAreaBaseClasses}
              placeholder="Ganhos esperados, como economia de tempo eredução de custos."
            />
          </section>

          <section className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <FieldLabel title="Submitter name" optional />
              <input
                type="text"
                name="re_author"
                value={form.re_author}
                onChange={handleChange}
                disabled={isAnonymous}
                className={`${inputBaseClasses} ${isAnonymous ? 'cursor-not-allowed bg-slate-100 text-slate-400' : ''}`}
                placeholder="Digite seu nome ou deixe em branco para usar a opção anônima."
              />
            </div>

          </section>

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
            <p className="max-w-2xl text-xs text-slate-500 sm:text-sm">
                Você pode visualizar sua inscrição antes de finalizá-la. Um ID exclusivo será atribuído após a
                confirmação.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                onClick={() => router.push('/')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}