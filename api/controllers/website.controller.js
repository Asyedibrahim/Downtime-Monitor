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
            let status = 'down'; // Default to 'down'

            try {
                // Make the request with a timeout of 5 seconds
                const response = await axios.get(website.url, { timeout: 5000 });

                // Only access status if the response exists and has a valid status
                if (response && response.status !== undefined) {
                    status = response.status === 200 ? 'up' : 'down';
                } else {
                    console.log(`Invalid response or status missing for ${website.url}`);
                }

                // Log the status to the website logs
                website.logs.push({ status });

                if (status === 'down') {
                    // Send an email alert if the website is down
                    const mailOptions = {
                        from: 'syedibrahim7252@gmail.com',
                        to: 'syedirctc45362@gmail.com',
                        subject: `Alert: ${website.url} is down!`,
                        text: `The website ${website.url} is currently down. Please check immediately.`,
                    };

                    await transporter.sendMail(mailOptions);
                }

            } catch (error) {
                // Handle the case where the request times out or fails
                console.error(`Error checking ${website.url}:`, error.message);
                website.logs.push({ status: 'down' });

                // Send an email alert when the website is down due to an error
                const mailOptions = {
                    from: 'syedibrahim7252@gmail.com',
                    to: 'syedirctc45362@gmail.com',
                    subject: `Alert: ${website.url} is down!`,
                    text: `The website ${website.url} is currently down due to an error: ${error.message}. Please check immediately.`,
                };

                await transporter.sendMail(mailOptions);
            }

            // Save the updated logs to the database
            await website.save();
        });

        // Wait for all status checks to complete
        await Promise.all(statusPromises);
        res.status(200).json(websites);
    } catch (error) {
        console.error(error);
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