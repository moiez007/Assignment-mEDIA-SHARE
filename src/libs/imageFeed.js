import { useEffect, useState } from 'react';
import { fetchImages } from '../services/postService';
import fallbackValue from './fallbackValue';

function imageFeed(searchTerm) {
  const debouncedSearch = fallbackValue(searchTerm, 300);

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadImages() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await fetchImages(debouncedSearch);

        if (!active) return;

        // ✅ normalize backend → frontend format
        const formatted = data.map((img) => ({
          id: img._id || img.id,
          title: img.title,
          caption: img.caption,
          location: img.location,
          imageUrl: img.url || img.imageUrl,
          author: img.creator?.username || img.creatorId?.username || img.author || 'Unknown',
          rating: img.averageRating ?? img.rating ?? 0,
          comments: Array(img.commentCount || img.commentsCount || 0).fill({})
        }));

        setImages(formatted);
      } catch (err) {
        if (active) {
          setErrorMessage('Failed to load images.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadImages();

    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  return { images, isLoading, errorMessage };
}

export default imageFeed;