/* eslint-disable @typescript-eslint/restrict-template-expressions */
interface FilterButton
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
  crossIcon?: boolean;
}

const FilterButton: React.FC<FilterButton> = ({ text, crossIcon, ...rest }) => {
  return (
    <button
      {...rest}
      className={`${
        crossIcon && 'flex flex-row gap-2'
      } items-center border border-blue-500 px-2 pb-1 rounded-md text-blue-500 w-fit hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring focus:ring-blue-200`}
    >
      <span>{text}</span>
      {crossIcon && (
        <img
          className="bg-blue-500 rounded-full"
          width={12}
          height={12}
          src="/cross-icon-button.png"
          alt="cross-icon-button"
        />
      )}
    </button>
  );
};

export default FilterButton;
