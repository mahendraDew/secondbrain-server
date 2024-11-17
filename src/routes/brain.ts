import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
dotenv.config()
import crypto from 'crypto'
import { ContentModel, LinkModel } from '../db/index' // Adjust paths as needed
import userMiddleware from '../middleware/usermiddleware'

const brainRouter = express.Router()
const SHAREABLE_LINK_HOST =
  process.env.SHAREABLE_LINK_HOST || 'http://localhost:3000'

interface User {
  _id: string
  email: string
  username: string
  // Add other fields if necessary
}
interface CustomRequest extends Request {
  user?: User
}
brainRouter.post('/share',userMiddleware, async (req: CustomRequest, res: Response): Promise<void> => {
    console.log("/share route hit")
    try {
      const { userId, share } = req.body
      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      // Check if the user has an existing shareable link
      const existingLink = await LinkModel.findOne({ userId })

      if (share) {
        // If sharing is enabled
        if (existingLink) {
          // Reuse existing link
          const hashval = existingLink.hash
          res.status(200).json({
            hashval
            })
            return;
        }

        // Create a new link
        const hash = require('crypto').randomBytes(16).toString('hex')
        const newLink = await LinkModel.create({ userId, hash })
        const hashvalue = newLink.hash;
        res.status(201).json({
              hashvalue
          })
          return;
      } else {
        // If sharing is disabled
        if (existingLink) {
          // Delete the existing link
          await LinkModel.deleteOne({ userId })
          res.status(200).json({ message: 'Sharing disabled, link removed.' });
          return;
        }

        // No link to remove
        res.status(404).json({ error: 'No shareable link found for this user.' });
        return;
      }
    } catch (error) {
      console.error('Error toggling shareable link:', error)
      res.status(500).json({ error: 'An error occurred while processing your request.' });
      return;
    }
})

brainRouter.get('/share/:hash', async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const hash = req.params.hash;
        // console.log("hash:",hash);
        // Find the link associated with the hash
        const link = await LinkModel.findOne({ hash });
        // console.log("link:",link);
        if (!link) {
          res.status(404).json({ error: 'Invalid or expired link' });
          return;
        }
    
        // Retrieve all shared contents for the associated user
        const sharedContents = await ContentModel.find({ 
          userId: link.userId
        });
        const userId = link.userId;
        res.status(200).json({userId, sharedContents});
      } catch (error) {
        console.error('Error retrieving shared contents:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the shared contents' });
      }
})

export default brainRouter
