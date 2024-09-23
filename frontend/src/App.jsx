import { Routes, Route, useLocation } from 'react-router-dom';
import AddWebsite from './pages/AddWebsite';
import WebsiteList from './pages/WebsiteList';
import WebsiteLogs from './pages/WebsiteLogs';
import Header from './components/Header';
import Edit from './pages/Edit';
import { Chart, registerables } from 'chart.js';
import Logs from './pages/Logs';
import { useEffect } from 'react';

// Registering components needed for the Line chart
Chart.register(...registerables);

function App() {

    const location = useLocation();

    useEffect(() => {
        switch (location.pathname) {
          case '/':
            document.title = 'Dashboard | List';
            break;
          case '/add':
            document.title = 'Downtime | Add url';
            break;
          case '/logs':
            document.title = 'Downtime | Logs';
            break;
          default:
            document.title = 'Downtime Monitor';
        }
      }, [location]);

    return (
        <>
        {!location.pathname.startsWith('/logs/') && <Header />}
            <Routes>
                <Route path="/" element={<WebsiteList />} />
                <Route path="/add" element={<AddWebsite />} />
                <Route path="/logs/:id" element={<WebsiteLogs />} />
                <Route path="/edit/:id" element={<Edit />} />
                <Route path="/logs" element={<Logs />} />
            </Routes>
        </>
    );
}

export default App;
