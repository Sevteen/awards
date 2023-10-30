/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useEffect, useState } from 'react';
import FilterButton from './FilterButton';
import { useDispatch, useSelector } from 'react-redux';
import { saveFilter } from '@domain/filter/awardFilter.slice';
import { RootState } from '@stores/stores';
import { formatCurrency } from '@utils/lib';

interface TypeAward {
  id: number;
  type: string;
  checked?: boolean;
}

const listAwardType: TypeAward[] = [
  { id: 1, type: 'All Type' },
  { id: 2, type: 'Vouchers' },
  { id: 3, type: 'Products' },
  { id: 4, type: 'Giftcard' },
];

const MIN_POINT = 10000;
const MAX_POINT = 1000000;

const Filter = ({ open, setOpen, onSubmit }) => {
  const filterAwards = useSelector((state: RootState) => state.filterAward);

  const [awardTypes, setAwardTypes] = useState(structuredClone(listAwardType));
  const [activeFilters, setActiveFilters] = useState({ point: false, type: false });
  const [types, setTypes] = useState<string[]>(filterAwards.types || []);
  const [point, setPoint] = useState({
    minPoint: MIN_POINT,
    maxPoint: filterAwards.point.maxPoint || MAX_POINT,
  });

  const dispatch = useDispatch();
  const onCheckType = (index: number) => {
    let tempAwardTypes = awardTypes;
    if (tempAwardTypes[index].id === 1) {
      if (tempAwardTypes[index].checked) {
        tempAwardTypes = tempAwardTypes.map((x) => (x.id === 1 ? { ...x, checked: false } : x));
      } else {
        tempAwardTypes = tempAwardTypes.map((x) => ({ ...x, checked: true }));
      }
    } else {
      tempAwardTypes[index].checked = !tempAwardTypes[index].checked;
    }

    setActiveFilters((prev) => ({ ...prev, type: true }));
    setTypes(tempAwardTypes.filter((x) => x.checked).map((o) => o.type));
    setAwardTypes(tempAwardTypes);
  };

  const onChangePoint = (e) => {
    const { value: maxPointValue } = e.target;
    setPoint({ minPoint: MIN_POINT, maxPoint: maxPointValue * 1 });
    setActiveFilters((prev) => ({ ...prev, point: true }));
  };

  const onCloseSelectedPoin = () => {
    setActiveFilters((prev) => ({ ...prev, point: false }));
    setPoint({ minPoint: MIN_POINT, maxPoint: MIN_POINT });
    dispatch(saveFilter({ ...filterAwards, point: { minPoint: MIN_POINT, maxPoint: MIN_POINT } }));
  };

  const onCloseSelectedType = () => {
    setActiveFilters((prev) => ({ ...prev, type: false }));
    setAwardTypes((prev) => {
      prev.forEach((x) => {
        x.checked = false;
      });

      return prev;
    });
    dispatch(saveFilter({ ...filterAwards, types: [] }));
  };

  const onClearAllFilters = () => {
    setActiveFilters({ point: false, type: false });
    setPoint({ minPoint: MIN_POINT, maxPoint: MIN_POINT });
    setAwardTypes((prev) => {
      prev.forEach((x) => {
        x.checked = false;
      });

      return prev;
    });
    dispatch(saveFilter({ point: { minPoint: MIN_POINT, maxPoint: MIN_POINT }, types: [] }));
  };

  return (
    <div
      className={`${
        !open ? 'hidden' : ''
      } fixed z-[1] overflow-x-hidden inset-y-0 left-0 w-full h-screen px-5 py-4 bg-white`}
    >
      <section className="flex flex-row items-center justify-between mb-4" id="titile">
        <p className="text-black text-3xl font-bold">Filter</p>
        <img
          className="hover:cursor-pointer"
          src="/cross-icon.svg"
          width={25}
          height={25}
          alt="cross-icon"
          onClick={setOpen}
        />
      </section>
      <section className="mb-5 flex flex-col gap-2" id="slected-filter">
        {activeFilters.point && (
          <FilterButton
            text={`Poin: ${MIN_POINT} - ${point.maxPoint}`}
            crossIcon
            onClick={onCloseSelectedPoin}
          />
        )}
        {activeFilters.type && (
          <FilterButton
            text={`Type: ${types.toString()}`}
            crossIcon
            onClick={onCloseSelectedType}
          />
        )}
        {activeFilters.point && activeFilters.type && (
          <FilterButton text="Clear All Filter" onClick={onClearAllFilters} />
        )}
      </section>
      <section id="poin-needed">
        <p className="text-gray-700 font-bold">Poin Needed</p>
        <div className="mb-4 mt-1 flex flex-row w-full justify-between">
          <p className="text-blue-500 font-bold">IDR {formatCurrency(MIN_POINT)}</p>
          <p className="text-blue-500 font-bold">IDR {formatCurrency(point.maxPoint)}</p>
        </div>
        <input
          type="range"
          name="poin"
          min={MIN_POINT}
          max={MAX_POINT}
          className="w-full mb-8"
          value={point.maxPoint}
          onChange={(e) => onChangePoint(e)}
        />
      </section>
      <section id="awards-type">
        <p className="text-gray-700 font-bold">Awards Type</p>
        {awardTypes.map((type, index) => {
          return (
            <div key={index} className="flex flex-row mt-2 gap-4 items-center">
              <input
                className="w-4 h-4"
                type="checkbox"
                name={type.type}
                checked={type.checked}
                onChange={(e) => onCheckType(index)}
                step={100}
              />
              <label className="font-medium text-blue-500">{type.type}</label>
            </div>
          );
        })}
      </section>
      <button
        onClick={() => {
          dispatch(saveFilter({ types, point }));
          onSubmit({ types, point });
        }}
        className="mt-16 bg-blue-500 text-gray-50 font-medium w-full rounded py-2 px-6 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
      >
        Filter
      </button>
    </div>
  );
};

export default Filter;
