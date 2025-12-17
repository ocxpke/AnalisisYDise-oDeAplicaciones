// Este archivo ya no se usa - El almacenamiento ahora es directo con Supabase PostgreSQL

export default function() {
  return new Response(
    JSON.stringify({ message: 'Este KV store ya no se usa.' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
