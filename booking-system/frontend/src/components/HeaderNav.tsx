import { FC } from "react";
import { Link } from "react-router-dom";

const HeaderNav: FC = () => {
  const isLoginPage = window.location.pathname.includes("login");

  return (
    <header className="bg-gray-900 text-white">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex flex-1">
          <a href="/frontend/" className="-m-1.5 p-1.5">
            <h2 className="text-2xl font-bold leading-7 text-white tracking-tight">
              Appointment Booking
            </h2>
          </a>
        </div>

        {!isLoginPage && (
          <div className="flex flex-1 justify-end">
            <Link
              to="login"
              className="text-sm font-semibold leading-6 text-white"
            >
              Admin <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default HeaderNav;
