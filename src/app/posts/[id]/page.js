"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

const PostDetailPage = ({ params }) => {
  const { id } = params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await axios.get(
          `https://nextupgrad.com/wp-json/wp/v2/posts/${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  const fetchFeaturedImage = async (mediaId) => {
    try {
      const response = await axios.get(
        `https://nextupgrad.com/wp-json/wp/v2/media/${mediaId}`
      );
      return response.data.source_url;
    } catch (error) {
      console.error("Error fetching featured image:", error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{post.title.rendered}</h1>
      {post.featured_media && <FeaturedImage mediaId={post.featured_media} />}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </div>
  );
};

const FeaturedImage = ({ mediaId }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    async function fetchImage() {
      const url = await fetchFeaturedImage(mediaId);
      setImageUrl(url);
    }

    fetchImage();
  }, [mediaId]);

  return (
    imageUrl && (
      <img src={imageUrl} alt="Featured" className={styles.featuredImage} />
    )
  );
};

const fetchFeaturedImage = async (mediaId) => {
  try {
    const response = await axios.get(
      `https://nextupgrad.com/wp-json/wp/v2/media/${mediaId}`
    );
    return response.data.source_url;
  } catch (error) {
    console.error("Error fetching featured image:", error);
    return null;
  }
};

export default PostDetailPage;
