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
            let status = 'down';

            try {
                // Using 'HEAD' method to check website status
                const response = await axios.head(website.url, { timeout: 5000 });
                
                // Check if response status is valid
                if (response && response.status === 200) {
                    status = 'up';
                } else {
                    console.error(`Invalid response for ${website.url}`);
                }
            } catch (error) {
                console.error(`Error checking ${website.url}: ${error.message}`);
            }

            // Push status into logs
            website.logs.push({ status });

            // Handle 'down' case (sending email, etc.)
            if (status === 'down') {
                const mailOptions = {
                    from: 'syedibrahim7252@gmail.com',
                    to: 'syedirctc45362@gmail.com',
                    subject: `Website Down: ${website.url}`,
                    text: `The website ${website.url} appears to be down.`,
                };
                try {
                    await transporter.sendMail(mailOptions);
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