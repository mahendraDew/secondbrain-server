import { Router, Request, Response } from 'express'
import { ContentModel } from '../db'
import mongoose from 'mongoose'
const contentRouter = Router()

contentRouter.get('/test', (req: Request, res: Response) => {
  res.json({
    msg: '/content/test route'
  })
})

contentRouter.post('/create', async (req: Request, res: Response) => {
  try {
    const { link, type, title, description, tags, userId } = req.body

    await ContentModel.create({
      link,
      type,
      title,
      description,
      date: Date.now(),
      tags,
      userId
    })
    res.status(201).json({
      msg: `Content is created`
    })
  } catch (error) {
    res.status(500).json({
      msg: 'Error: something went wrong!',
      error: error
    })
  }
})

contentRouter.delete('/remove', async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentId, userId } = req.body;

    if (!contentId || !userId) {
      res.status(400).json({ msg: 'Content ID and User ID are required' });
      return;
    }

    // Check if contentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
        res.status(400).json({ message: 'Invalid Content ID' });
        return;
      }

    const content = await ContentModel.findById(contentId)

    if (!content) {
      res.status(404).json({ msg: 'Content not found' });
      return;
    }

    // Check if the user making the request is the owner of the content
    if (content.userId && content.userId.toString() !== userId) {
      res.status(403).json({ msg: 'You are not authorized to delete this content' });
      return ;
    }

   
    await ContentModel.findByIdAndDelete(contentId)


    res.status(200).json({ msg: 'Content deleted successfully' });
    return ;
  } catch (error) {
    console.error('Error deleting content:', error)
    res.status(500).json({ msg: 'Internal Server Error' });
    return ;
  }
})

export default contentRouter
