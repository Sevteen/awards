/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

function useInfiniteScroll<T = any>(fetchData) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const hasMoreData = useRef(true);
  const pageRef = useRef(null);
  const page = useRef(1);

  const loadMoreData = async () => {
    if (!isLoading && hasMoreData.current) {
      setIsLoading(true);
      try {
        const res = await fetchData({ page: page.current });
        page.current += 1;

        setData((prev) => {
          const tempArray = [...prev, ...res.data];

          if (tempArray.length == res.totalCount) {
            hasMoreData.current = false;
          }

          return tempArray;
        });
      } catch (error) {
        console.error('Error loading more data:', error);
      }
      setIsLoading(false);
    }
  };

  const trigger = async (query) => {
    setIsLoading(true);
    const res = await fetchData(query);
    setData(res.data);
    if (res.totalCount > res.data.length) {
      hasMoreData.current = true;
    } else {
      hasMoreData.current = false;
    }
    setIsLoading(false);
  };

  const debounceLoadMore = useCallback(() => {
    return debounce(loadMoreData, 300);
  }, [fetchData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          debounceLoadMore()();
        }
      },
      { threshold: 0.1 }
    );

    if (pageRef.current) {
      observer.observe(pageRef.current);
    }

    return () => {
      if (pageRef.current) {
        observer.unobserve(pageRef.current);
      }
    };
  }, [debounceLoadMore]);

  return { data, pageRef, isLoading, triggerFetch: trigger };
}

export default useInfiniteScroll;
