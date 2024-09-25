import Website from '../models/website.model.js';
import axios from 'axios';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'syedibrahim7252@gmail.com',
      pass: process.env.APP_PASSWORD,
    },
});

// Add a website to track
export const addWebsite = async (req, res) => {
    const { url } = req.body;
    const website = new Website({ url });
    try {
        await website.save();
        res.status(201).json({message : 'Url added successfully'});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Check the status of the website (up or down)
export const checkWebsiteStatus = async (req, res) => {
  try {
    const websites = await Website.find();

    const statusPromises = websites.map(async (website) => {
      let status = 'down'; // Default to 'down' if the request fails

      try {
        // Increase timeout value if necessary, based on your needs
        const response = await axios.get(website.url, { timeout: 7000 });

        if (response && typeof response.status === 'number') {
          status = response.status === 200 ? 'up' : 'down';
        } else {
          console.error(`Invalid or missing response for ${website.url}`);
        }
      } catch (error) {
        // Handle Axios-specific errors more carefully
        if (error.code === 'ECONNABORTED') {
          console.error(`Timeout exceeded for ${website.url}: ${error.message}`);
          // Optionally, consider retrying the request (see below)
        } else if (error.response && typeof error.response.status === 'number') {
          // Handle server response errors (e.g., 4xx or 5xx status codes)
          console.error(`Received error response from ${website.url}: ${error.response.status}`);
        } else {
          // Handle other errors (e.g., network issues)
          console.error(`Error checking ${website.url}: ${error.message}`);
        }
      }

      website.logs.push({ status });

      if (status === 'down') {
        const mailOptions = {
          from: 'syedibrahim7252@gmail.com',  // Sender address
          to: 'syedirctc45362@gmail.com',         // List of receivers
          subject: `Website Down: ${website.url}`,  // Subject line
          text: `The website ${website.url} appears to be down. Please check.`  // Plain text body
        };
        try {
          await transporter.sendMail(mailOptions); // Handle email sending errors
        } catch (mailError) {
          console.error(`Failed to send email for ${website.url}: ${mailError.message}`);
        }
      }

      await website.save();
    });

    await Promise.all(statusPromises);

    res.status(200).json(websites);
  } catch (globalError) {
    console.error(`Failed to check website status: ${globalError.message}`);
    res.status(500).json({ error: 'Failed to check website status' });
  }
};

// Get logs of a website
export const getWebsiteLogs = async (req, res) => {
    const { id } = req.params;
    try {
        const website = await Website.findById(id);
        res.json(website.logs);
    } catch (error) {
        res.status(404).json({ error: 'Website not found' });
    }
};

// Get logs of a website
export const getWebsiteUrls = async (req, res) => {
    const { id } = req.params;
    try {
        const website = await Website.findById(id);
        res.json({ url: website.url });
    } catch (error) {
        res.status(404).json({ error: 'Website not found' });
    }
};

export const deleteUrl = async (req, res) => {
    try {
  
      if (!req.params.id) {
        return res.status(500).json({ error: 'Website url not found!!' });
      }
  
      await Website.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Url is deleted!' })
  
    } catch (error) {
      res.status(500).json({ error: 'Server Error' });
    }
};

export const editUrl = async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(500).json({ error: 'Website url not found!!' });
      }
  
      const editedUrl = await Website.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true}
      );
      res.status(200).json(editedUrl);
  
    } catch (error) {
      res.status(500).json({ error: 'Server Error' });
    }
};