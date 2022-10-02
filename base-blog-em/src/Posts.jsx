import { useEffect } from "react";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";

import { PostDetail } from "./PostDetail";

async function fetchPosts(pageNumber) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNumber}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 2000,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (currentPage === 10) return;

    const nextPage = currentPage + 1;

    queryClient.prefetchQuery(["post", nextPage], () => fetchPosts(nextPage), {
      staleTime: 2000,
    });
  }, [currentPage, queryClient]);

  if (isLoading) return <h3>Loading..</h3>;
  if (isError) return <h3>Error..</h3>;

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= 10}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
