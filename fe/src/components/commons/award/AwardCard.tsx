import { capitalize } from 'lodash';
import React from 'react';

interface AwardCardProps {
  type: string;
  point: number;
  name: string;
  image: string;
}

const AwardCard: React.FC<AwardCardProps> = ({ type, point, name, image }) => {
  let color: string;
  switch (type) {
    case 'Vouchers':
      color = 'bg-blue-500';
      break;
    case 'Products':
      color = 'bg-orange-700';
      break;
    case 'Giftcard':
      color = 'bg-green-700';
      break;
    default:
      color = '';
      break;
  }

  return (
    <div>
      <div
        className="mb-1 bg-gray-300 rounded-lg px-3 py-3 drop-shadow-sm"
        style={{
          backgroundImage: `url(${image})`,
          objectFit: 'contain',
          aspectRatio: 4 / 2,
          width: '100%',
        }}
      >
        <p className={`text-gray-100 tracking-wide ${color} px-3 py-1 rounded w-fit float-right`}>
          {capitalize(type)}
        </p>
        <p className="text-gray-600 font-bold">{point} Point</p>
      </div>
      <span className="text-gray-700 font-bold tracking-wide">{name}</span>
    </div>
  );
};

export default AwardCard;
