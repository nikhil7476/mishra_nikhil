"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

const PostDetailPage = ({ params }) => {
  const { id } = params;
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await axios.get(
          `https://nextupgrad.com/wp-json/wp/v2/posts/${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }

    fetchPost();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title.rendered}</h1>
      {post.featured_media && (
        <img 
          src={`https://nextupgrad.com/wp-json/wp/v2/media/${post.featured_media}`}
          alt={post.title.rendered} 
          style={{ width: "100%", borderRadius: "8px" }} 
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </div>
  );
};

export default PostDetailPage;
