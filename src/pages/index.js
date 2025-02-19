import { useState } from "react";
import Link from "next/link";
import { fetchPosts } from "../apis/api";
import nlp from "compromise";

export default function Home({ posts }) {
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  const extractKeywords = (text) => {
    const doc = nlp(text);
    return doc.topics().out("array");
  };

  const processedPosts = posts.map((post) => {
    const keywords = extractKeywords(post.body);
    return { ...post, keywords };
  });

  const filteredPosts = selectedKeyword
    ? processedPosts.filter((post) =>
        post.keywords.some(
          (keyword) => keyword.toLowerCase() === selectedKeyword.toLowerCase()
        )
      )
    : processedPosts;

  function removeGlobalDuplicates(arr, keys) {
    const seenWords = new Set();

    return arr.map((obj) => {
      const newObj = { ...obj };

      keys.forEach((key) => {
        if (Array.isArray(newObj[key])) {
          newObj[key] = newObj[key].filter((word) => {
            if (seenWords.has(word)) {
              return false; 
            }
            seenWords.add(word);
            return true; 
          });
        }
      });

      return newObj;
    });
  }

  const postToUse = removeGlobalDuplicates(processedPosts, ["keywords"]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de posts</h2>

      <div className="flex flex-wrap justify-center mb-6">
        {postToUse
          .flatMap((post) => post.keywords)
          .map((keyword, index) => (
            <button
              key={index}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full m-1 hover:bg-blue-600 transition"
              onClick={() => setSelectedKeyword(keyword)}
            >
              #{keyword}
            </button>
          ))}
      </div>

      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200"
          >
            <Link
              className="text-xl font-semibold text-gray-800 mb-2"
              href={`/post/${post.id}`}
            >
              {post.title}
            </Link>

            <p className="text-gray-600 mb-4">
              {post.body.length > 100
                ? post.body.substring(0, 100) + "..."
                : post.body}
            </p>
            <div className="flex flex-wrap mb-3">
              {post.keywords.map((keyword, index) => (
                <button
                  key={index}
                  className="text-blue-500 text-sm px-2 py-1 bg-gray-100 rounded-full mr-2 mb-2 hover:bg-gray-200 transition"
                  onClick={() => setSelectedKeyword(keyword)}
                >
                  #{keyword}
                </button>
              ))}
            </div>
            <Link
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
              href={`/post/${post.id}`}
            >
              Ler mais
            </Link>
          </div>
        ))
      ) : (
        <p className="text-gray-600 text-center">
          Nenhum post encontrado com essa hashtag.
        </p>
      )}
    </div>
  );
}

export async function getStaticProps() {
  try {
    const posts = await fetchPosts();
    return {
      props: { posts },
      revalidate: 10,
    };
  } catch (error) {
    return {
      props: { posts: [] },
    };
  }
}
