/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { Suspense, lazy, useEffect, useRef, useState } from 'react';

import { api } from '@services/index';
import Navbar from '@components/ui/section/Navbar';
import Filter from '@components/ui/filter/Filter';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { useSelector } from 'react-redux';
import { RootState } from '@stores/stores';
import qs from 'qs';

const AwardCard = lazy(() => import('@components/commons/award/AwardCard'));

const Home = () => {
  const filterAwards = useSelector((state: RootState) => state.filterAward);

  const [filter, setFilter] = useState(false);

  const getAwardList = async (query: any = {}) => {
    query.limit = 4;
    query.page = query.page || 1;
    if (filterAwards.point.maxPoint > filterAwards.point.minPoint) {
      Object.assign(query, filterAwards.point);
    } else {
      delete query['point'];
    }
    if (filterAwards.types.length > 0) {
      Object.assign(query, { types: filterAwards.types.map((x) => x.toLowerCase()) });
    } else {
      delete query['types'];
    }

    const response = await api.get(`api_v1/awards`, qs.stringify({ ...query }));
    const { data, status } = response;

    if (status === 'OK') {
      return data;
    }

    return { data: [], totalCount: 0 };
  };

  const {
    data: awards,
    pageRef: bottomPageRef,
    isLoading,
    triggerFetch,
  } = useInfiniteScroll(getAwardList);

  const onSubmitFilter = (query) => {
    const params = {};
    if (query.point.maxPoint > query.point.minPoint) {
      Object.assign(params, filterAwards.point);
    } else {
      delete params['point'];
    }
    if (query.types.length > 0) {
      Object.assign(params, { types: query.types.map((x) => x.toLowerCase()) });
    } else {
      delete params['types'];
    }
    triggerFetch(params);
  };

  return (
    <>
      <Navbar openFilter={filter} setOpenFilter={setFilter} />
      <Filter open={filter} setOpen={() => setFilter(!filter)} onSubmit={onSubmitFilter} />
      <div className="px-7 pt-7 h-full flex flex-col gap-5">
        {awards && awards.length < 1 ? (
          <div className="flex flex-col justify-center items-center gap-2">
            <img src="/star-icon.png" width={200} height={200} alt="star-icon" />
            <p className="font-medium text-xl">No Awards Found</p>
          </div>
        ) : (
          awards &&
          awards.map((award: any) => (
            <Suspense key={award._id} fallback={<div>Loading...</div>}>
              <AwardCard
                type={award.type}
                point={award.poin}
                name={award.name}
                image={award.image}
              />
            </Suspense>
          ))
        )}
        {isLoading && <span className="font-medium text-xl">Loading More Data</span>}
        <div ref={bottomPageRef} />
      </div>
    </>
  );
};

export default Home;
