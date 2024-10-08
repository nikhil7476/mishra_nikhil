"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get(
          "https://nextupgrad.com/wp-json/wp/v2/posts"
        );

        const postsWithImages = await Promise.all(
          response.data.map(async (post) => {
            if (post.featured_media) {
              try {
                const imageResponse = await axios.get(
                  `https://nextupgrad.com/wp-json/wp/v2/media/${post.featured_media}`
                );
                return {
                  ...post,
                  featured_image: imageResponse.data.source_url,
                };
              } catch (error) {
                console.error("Error fetching featured image:", error);
                return { ...post, featured_image: null };
              }
            }
            return { ...post, featured_image: null };
          })
        );

        setPosts(postsWithImages);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const trimExcerpt = (excerpt, wordCount) => {
    const words = excerpt.split(" ");
    return words.length > wordCount
      ? words.slice(0, wordCount).join(" ") + "..."
      : excerpt;
  };

  if (loading) {
    // Loader UI when loading state is true
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        <p>Loading blog posts...</p>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h1>Blog Posts From Nextupgrad</h1>
      <div className={styles.cardContainer}>
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className={styles.card}
          >
            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title.rendered}
                className={styles.image}
              />
            )}
            <h2>{post.title.rendered}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: trimExcerpt(post.excerpt.rendered || "", 20),
              }}
            />
            <p>Read More</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
