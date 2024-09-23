import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Foot from '../components/Foot';
import back2 from '../assets/images/Back1.jpg';

const Logs = () => {
  const [websites, setWebsites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10); // Number of rows per page

  // Fetch websites data from API
  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const { data } = await axios.get('/api/websites/status');
        setWebsites(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchWebsites();
  }, []);

  // Pagination calculations
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = websites.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(websites.length / rowsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredDownRows = currentRows.filter((website) => 
    website.logs[website.logs.length - 1]?.status === 'down'
  );

  return (
    <div className="bg-cover min-h-screen" style={{ backgroundImage: `url(${back2})` }}>
      <div className="backdrop-blur-sm min-h-screen flex flex-col">
        <div className="mx-auto max-w-7xl py-10 lg:px-2 flex-grow">
          <div className="rounded-3xl overflow-hidden sm:mt-2">
            <div className="sm:p-5 lg:flex lg:flex-col lg:items-center">
              
              {/* Title */}
              <h1 className="text-center text-2xl font-bold mb-6">Current Down Websites</h1>

              {/* Table */}
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-lime-400 dark:text-black">
                    <tr>
                      <th scope="col" className="px-6 py-3">Website URL</th>
                      <th scope="col" className="px-6 py-3">Latest Status</th>
                      <th scope="col" className="px-6 py-3">Http</th>
                      <th scope="col" className="px-6 py-3">View Graph</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDownRows.length > 0 ? filteredDownRows.map((website) => (
                      <tr className="bg-white border-b dark:bg-gray-100 dark:border-gray-700" key={website._id}>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black">
                          <a href={website.url} target='_blank' rel="noopener noreferrer">{website.url}</a>
                        </th>
                        <td className={`px-6 py-4 capitalize font-semibold ${website.logs[website.logs.length - 1]?.status === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {website.logs[website.logs.length - 1]?.status || 'No Status'}
                        </td>
                        <td className="px-6 py-4">
                          {website.logs[website.logs.length - 1]?.status === 'up' ? 200 : 503}
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/logs/${website._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                            View Graph
                          </Link>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No websites available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex justify-center space-x-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
        {/* Footer */}
        <Foot />
      </div>
    </div>
  );
};

export default Logs;
