import { fetchPosts } from "../../apis/api";

export default function Post({ post }) {
  if (!post) {
    return <p>Postagem não encontrada.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-sm mx-4 bg-white rounded-lg shadow-md p-3 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {post.title}
        </h2>
        <p className="text-gray-600 mb-4">{post.body}</p>
        <p className="text-gray-600 mb-4">
          <span className="font-semibold text-gray-800">Post ID :</span>
          {post.id}
        </p>
        <p className="text-gray-600 mb-4">
          <span className="font-semibold text-gray-800">Author :</span>
          {post.userId}
        </p>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const posts = await fetchPosts();

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const posts = await fetchPosts();
  const post = posts.find((post) => post.id.toString() === params.id);

  return {
    props: {
      post,
    },
  };
}
