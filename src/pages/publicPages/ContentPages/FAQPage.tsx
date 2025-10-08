// src/pages/user/ContentPages/FAQPage.tsx

import React, { useState, useEffect } from 'react';
import { getContentByKey } from '../../../services/contentService';
import type { ContentResponse } from '../../../services/contentService';

const FAQPage: React.FC = () => {
  const [content, setContent] = useState<ContentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent('faq');
  }, []);

  const fetchContent = async (key: string) => {
    try {
      setLoading(true);
      const data = await getContentByKey(key);
      setContent(data);
    } catch (error: any) {
      setError(error.message || 'Failed to load FAQ content.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
     {/* <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{content?.title || 'Frequently Asked Questions'}</h1> */}
      <div dangerouslySetInnerHTML={{ __html: content?.content || '' }} />
    </div>
  );
};

export default FAQPage;