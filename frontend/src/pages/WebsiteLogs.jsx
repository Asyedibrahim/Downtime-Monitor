import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const WebsiteLogs = () => {
  const { id } = useParams();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interval, setInterval] = useState('24');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await axios.get(`/api/websites/${id}/logs`);
        setLogs(data);
      } catch (error) {
        setError('Error fetching website logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  const now = new Date();
  const intervalHours = parseInt(interval);
  const cutoffTime = new Date(now.getTime() - intervalHours * 60 * 60 * 1000);

  const filteredLogs = logs.filter(log => new Date(log.timestamp) >= cutoffTime);

  const data = filteredLogs.map(log => ({
    time: new Date(log.timestamp).toLocaleString(),
    status: log.status === 'up' ? 1 : 0,
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Website Logs</h1>
      
      <div className="mb-4">
        <label htmlFor="interval" className="mr-2">Select Time Interval:</label>
        <select
          id="interval"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="border rounded p-2"
        >
          <option value="6">Last 6 hours</option>
          <option value="12">Last 12 hours</option>
          <option value="24">Last 24 hours</option>
        </select>
      </div>

      {filteredLogs.length === 0 ? (
        <p className="text-lg text-gray-500">No logs available for this interval</p>
      ) : (
        <ResponsiveContainer width="95%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="status" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WebsiteLogs;
