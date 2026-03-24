import Link from 'next/link';

export default function IdeaCard({ idea }) {
  return (
    <div style={{
      border: '1px solid #ccc', 
      padding: '1rem', 
      marginBottom: '1rem', 
      borderRadius: '8px'
    }}>
      <h3>{idea.what_to_improve}</h3>
      <p>Status: {idea.status}</p>
      <p>Bloqueada: {idea.is_locked ? 'Sim' : 'Não'}</p>
      <Link href={`/ideas/${idea.id}`}>
        <button>Ver detalhes</button>
      </Link>
    </div>
  );
}