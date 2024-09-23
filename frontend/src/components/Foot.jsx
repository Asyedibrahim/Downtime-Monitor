import foot from '../assets/images/logo2.png';

export default function Foot() {
  return (
    <footer className="shadow backdrop-blur-sm pr-3 px-3 dark:bg-transparent">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between">
          <a href="https://digiplusagency.com/" className="flex items-center space-x-3">
            <img src={foot} className="h-16" alt="Logo" />
          </a>
          <ul className="flex space-x-6 text-sm font-medium text-gray-500 dark:text-black">
            <li><a href="https://digiplusagency.com/digiplus-team/" className="hover:underline">About</a></li>
            <li><a href="https://digiplusagency.com/privacy-policy/" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Licensing</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>
        <hr className="border-gray-200" />
        <span className="block text-center text-sm text-gray-500 dark:text-black py-2">
          © 2024 <a href="https://digiplusagency.com/" className="hover:underline">digiplusagency</a>. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
