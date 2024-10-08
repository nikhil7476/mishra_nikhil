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
    let isMounted = true;

    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://nextupgrad.com/wp-json/wp/v2/posts/${id}`);
        if (isMounted) {
          setPost(response.data);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        if (isMounted) {
          setError("Failed to load post.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{post.title.rendered}</h1>
      {post.featured_media && <FeaturedImage mediaId={post.featured_media} />}
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </div>
  );
};

const FeaturedImage = ({ mediaId }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!mediaId) return;

      try {
        const response = await axios.get(`https://nextupgrad.com/wp-json/wp/v2/media/${mediaId}`);
        setImageUrl(response.data.source_url);
      } catch (error) {
        console.error("Error fetching featured image:", error);
      }
    };

    fetchImage();
  }, [mediaId]);

  if (!imageUrl) return null;

  return <img src={imageUrl} alt="Featured" className={styles.featuredImage} />;
};

export default PostDetailPage;
