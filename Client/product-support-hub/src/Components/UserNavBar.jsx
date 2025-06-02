import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.png';

function UserNavBar({ theme }) {
  const headerStyle = {
    backgroundColor: theme.components.header.backgroundColor,
    color: theme.components.header.color,
    padding: theme.spacing.md,
  };
  return (
    <header style={headerStyle} className="flex flex-row items-center gap-4">
      <img className="w-44" src={logo} alt="" />
      <div className="flex flex-row items-center gap-4">
        <div className="text-md font-sans w-44 text-stone-50">
          Product Support Hub
        </div>
      </div>
      <div style={{ width: '80%' }} className="flex justify-end ">
        <div className="text-stone-50">Admin Dashboard </div>
        <Link className="text-stone-50" to="/createpost">
          Create a post
        </Link>
      </div>
    </header>
  );
}

export default UserNavBar;
