const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Post = require('../../models/Post');
const User = require('../../models/User');

// @ route post api/post
// @ desc   create a post
// @ access public
router.post(
  '/',
  [
    auth,
    check('text', 'Text is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select({ password: 0 });
      const newPost = new Post({
        name: user.name,
        avatar: user.avatar,
        user: user.id,
        text: req.body.text
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  }
);

// @ route post api/get
// @ desc   get all post
// @ access private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// @ route post api/get
// @ desc   get post by id
// @ access private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status().json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @ route post api/delete
// @ desc   delte post
// @ access private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }
    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'user not authorized' });
    }
    await post.remove();
    res.json({ msg: 'Post removed ' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send(err.message);
  }
});

// @ route post api/posts/like/:id
// @ desc   like a post
// @ access private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// @ route post api/posts/unlike/:id
// @ desc   unlike a post
// @ access private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// @ route post api/posts/comment/:id
// @ desc   comment on a post
// @ access private
router.post(
  '/comment/:id',
  [
    auth,
    check('text', 'Text is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select({ password: 0 });
      const post = await Post.findById(req.params.id);
      const newComment = new Post({
        name: user.name,
        avatar: user.avatar,
        user: user.id,
        text: req.body.text
      });

      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  }
);

// @ route post api/posts/comment/:id/:comment_id
// @ desc   delete comment
// @ access private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // pull out comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    // make sure comment exist
    if (!comment) {
      return res.status(404).json({ msg: "comment doesn't exist" });
    }

    // check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'user not authorized' });
    }

    // get remove index
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
