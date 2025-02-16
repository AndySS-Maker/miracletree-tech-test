export async function fetchPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!res.ok) {
    throw new Error("Erro ao buscar os posts");
  }
  return res.json();
}