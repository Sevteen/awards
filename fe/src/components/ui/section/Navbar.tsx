import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface NavbarProps {
  openFilter: boolean;
  setOpenFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ openFilter, setOpenFilter }) => {
  const { pathname } = useLocation();
  const listMenu = [
    { name: 'Home', function: () => setMenu(!menu), active: pathname.includes('home') },
    { name: 'Cards', function: () => null, active: pathname.includes('cards') },
    { name: 'Profile', function: () => null, active: pathname.includes('profile') },
    { name: 'Logout', function: () => null, active: pathname.includes('logout') },
  ];
  const [menu, setMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenu(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <nav>
      <ul className="flex px-4 py-1 flex-row w-full items-center justify-between">
        <li>
          <img
            className="hover:cursor-pointer"
            src="/hamburger-icon.svg"
            width={35}
            height={35}
            alt="hamburger-icon"
            onClick={() => setMenu(!menu)}
          />
        </li>
        <li>
          <p className="hover:cursor-pointer text-3xl font-bold">Awards</p>
        </li>
        <li>
          <img
            className="hover:cursor-pointer"
            src="/filter-icon-2.svg"
            width={35}
            height={35}
            alt="gambar-filter-menu"
            onClick={() => setOpenFilter(!openFilter)}
          />
        </li>
      </ul>
      <div
        className={`${
          !menu ? 'hidden' : ''
        } fixed z-[1] overflow-x-hidden bg-black/40 min-w-full min-h-full inset-y-0 left-0`}
      >
        <div
          ref={menuRef}
          className="w-4/6 duration-1000 flex flex-col pt-24 items-center min-h-screen bg-white"
        >
          <ul className="flex flex-col gap-5">
            <li>
              <img src="/star-icon.png" width="100" height="100" alt="gambar-bintang" />
            </li>
            <li>
              <p className="text-black text-xl font-extrabold">Awards Menu</p>
            </li>
            {listMenu.map((menu, index) => {
              return (
                <li
                  onClick={menu.function}
                  className={`${
                    menu.active ? 'text-black' : ''
                  }text-gray-400 font-medium cursor-pointer hover:text-black`}
                  key={index}
                >
                  {menu.name}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
