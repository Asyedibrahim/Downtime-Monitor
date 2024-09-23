import { useState } from 'react';
import axios from 'axios';
import back2 from '../assets/images/Back1.jpg';
import Foot from '../components/Foot';
import { useNavigate } from 'react-router-dom';

const AddWebsite = () => {

    const [url, setUrl] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/websites', { url });
            alert('Website added!');
            navigate('/');
        } catch (error) {
            alert('Error adding website');
        }
    };

    return (
        <div className="bg-cover min-h-screen flex flex-col justify-between" style={{ backgroundImage: `url(${back2})` }}>
            <div className="flex-grow flex items-center justify-center backdrop-blur-sm py-12">
                <form onSubmit={handleSubmit} className="max-w-sm w-full bg-white rounded-xl px-4 py-10 shadow-xl mx-auto">
                <p className="text-center font-bold text-2xl font-sans text-green-500 mb-6">Add a website to monitor</p>

                <label htmlFor="text" className="block mb-2 text-sm font-medium text-black">Your URL</label>
                <input 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder='https://example.com'
                    type="text" 
                    id='url'
                    className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
                    required
                />

                <button 
                    type="submit" 
                    className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-2 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                    Add
                </button>
                </form>
            </div>
        <Foot />
        </div>
    );
};

export default AddWebsite;
