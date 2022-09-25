const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const ToWatch = require("../models/toWatch");
const Comment = require("../models/Comment");
const baseUrl = 'https://api.themoviedb.org/3/'


module.exports = {
  addToWatchList: async (req, res) => {
    console.log(req)
    try {
      const response = await fetch(`${baseUrl}movie/${req.body.movieId}?api_key=${process.env.API_KEY}&language=en-US`)
      const movie = await response.json() 
      await ToWatch.create({
        title: movie.title,
        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
      console.log("Movie added to Watch List!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getMovies: async (req, res) => {
    try {
      console.log(req.body.search)
      const response = await fetch(`${baseUrl}search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${req.body.search}&page=1&include_adult=false`)
      const movies = await response.json()
      res.render("feed.ejs", { movies: movies.results });
    } catch (err) {
      console.log(err);
    }
  },
  getWatchlist: async (req, res) => {
    try {
      const watchlist = await ToWatch.find();
      res.render("watchlist.ejs", { watchlist: watchlist });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "desc" }).lean();
      res.render("post.ejs", { post: post, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
