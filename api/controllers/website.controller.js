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
        const websites = await Website.find(); // Fetch all websites from the database

        // Check status for each website
        const statusPromises = websites.map(async (website) => {
            let status = 'down'; // Default status

            try {
                // Send a 'HEAD' request with a 7000ms timeout
                const response = await axios.head(website.url, { timeout: 7000 });

                // Check if the response is valid and status is 200
                if (response && response.status === 200) {
                    status = 'up'; // Update status to 'up'
                }
            } catch (error) {
                console.error(`Error checking ${website.url}: ${error.message}`);
                // Handle timeout or connection errors
                if (error.code === 'ECONNABORTED') {
                    console.error(`Timeout for ${website.url}: ${error.message}`);
                }
            }

            // Append the status to website logs
            website.logs.push({ status });

            // Send email alert if website is down
            if (status === 'down') {
                const mailOptions = {
                    from: 'syedibrahim7252@gmail.com',
                    to: 'syedirctc45362@gmail.com, bharath.mv@gmail.com, jeevadharshinibala2001@gmail.com, ramvijayaravi@gmail.com',
                    subject: `Website Down: ${website.url}`,
                    text: `The website ${website.url} appears to be down.`,
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`Email sent for ${website.url}`);
                } catch (mailError) {
                    console.error(`Failed to send email for ${website.url}: ${mailError.message}`);
                }
            }

            await website.save();
        });

        // Wait for all status checks to complete
        await Promise.all(statusPromises);

        // Ensure response is sent only once
        if (res && !res.headersSent) {
            return res.status(200).json(websites);
        }

    } catch (globalError) {
        console.error(`Failed to check website status: ${globalError.message}`);

        // Check if the response object exists and headers are not already sent
        if (res && !res.headersSent) {
            return res.status(500).json({ error: 'Failed to check website status' });
        }
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