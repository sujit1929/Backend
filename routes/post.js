const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// ✅ Create a new post
router.post('/', async (req, res) => {
    try {
      console.log('Incoming data:', req.body); // ✅
      const post = new Post(req.body);
      await post.save();
      res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
      console.error('Error saving post:', error); // ✅
      res.status(500).json({ message: 'Failed to create post', error });
    }
  });
  

// ✅ Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name email');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error });
  }
});

// ✅ Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post', error });
  }
});

// ✅ Update a post
router.put('/:id', async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error });
  }
});

// ✅ Delete a post
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error });
  }
});

module.exports = router;
