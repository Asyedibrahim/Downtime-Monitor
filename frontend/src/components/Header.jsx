import logo from '../assets/images/logo1.png'
import { Link, useLocation } from 'react-router-dom'

export default function Header() {

  const location = useLocation();

  return (
    <div>
      <nav className="xl:w-full rounded-b-xl border-gray-200 dark:bg-black dark:border-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between">
          <a href="https://digiplusagency.com/" className="flex items-center px-5 space-x-3 rtl:space-x-reverse">
              <img src={logo} className="h-16 " alt="Logo" />
          </a>

          <button data-collapse-toggle="navbar-dropdown" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-dropdown" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
          </button>

          <div className="hidden md:block" id="navbar-dropdown">
            <ul className="flex flex-col font-semibold font-sans md:p-3  border-white-100  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-white-100 md:dark:bg-white-100 dark:border-green-700">
                <li>
                    <Link to='/' className={`block py-2 px-3 rounded md:border-0 md:p-0 ${location.pathname === '/' ? ' text-green-500 font-bold' : 'text-white dark:hover:text-green-500'}`}>Home</Link>
                </li>
                <li>
                    <Link to='/add' className={`block py-2 px-3 rounded md:border-0 md:p-0 ${location.pathname === '/add' ? ' text-green-500 font-bold' : 'text-white dark:hover:text-green-500'}`}>Add</Link>
                </li>
                <li>
                    <Link to='/logs' className={`block py-2 px-3 rounded md:border-0 md:p-0 ${location.pathname === '/logs' ? ' text-green-500 font-bold' : 'text-white dark:hover:text-green-500'}`}>Logs</Link>
                </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
