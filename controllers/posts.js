const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const ToWatch = require("../models/toWatch");
const Journal = require("../models/Journal");
const Comment = require("../models/Comment");
const List = require("../models/List");
const baseUrl = 'https://api.themoviedb.org/3/'


module.exports = {
  addToWatchList: async (req, res) => {
    console.log(req)
    try {
      const response = await fetch(`${baseUrl}movie/${req.body.movieId}?api_key=${process.env.API_KEY}&language=en-US`)
      const movie = await response.json() 
      await ToWatch.create({
        title: movie.title,
        image: `https://image.tmdb.org/t/p/w185${movie.poster_path}`,
        movieId: req.body.movieId,
        dateAdded: new Date().toLocaleDateString()
      });
      console.log("Movie added to Watch List!");
      res.redirect("/watchlist");
    } catch (err) {
      console.log(err);
    }
  },
  addToJournal: async (req, res) => {
    console.log(req)
    try {
      console.log(req)
      const response = await fetch(`${baseUrl}movie/${req.body.movieId}?api_key=${process.env.API_KEY}&language=en-US`)
      const movie = await response.json() 
      await Journal.create({
        title: movie.title,
        movieId: req.body.movieId,
        image: `https://image.tmdb.org/t/p/w185${movie.poster_path}`,
        dateWatched: req.body.dateWatched,
        rating: req.body.rating,
        comments: req.body.comments,
      });
      console.log("Movie added to Journal!");
      res.redirect("/journal");
    } catch (err) {
      console.log(err);
    }
  },
  getProfile: async (req, res) => {
    try {
      // const response = await fetch(`${baseUrl}trending/movie/week?api_key=${process.env.API_KEY}`)
      const lists = await List.find().sort({ likes: "desc" })
      // const trending = await response.json()
      // console.log(trending)
      res.render("profile.ejs", { user: req.user, lists: lists });
    } catch (err) {
      console.log(err);
    }
  },
  getCreateList: (req, res) => {
      res.render("createlist.ejs", { user: req.user });
  },
  getMovies: async (req, res) => {
    try {
      const response = await fetch(`${baseUrl}search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${req.body.search}&page=1&include_adult=false`)
      const movies = await response.json()
      res.render("feed.ejs", { movies: movies.results });
    } catch (err) {
      console.log(err);
    }
  },
  getDetails: async (req, res) => {
    try {
      const response = await fetch(`${baseUrl}movie/${req.params.id}?api_key=${process.env.API_KEY}&language=en-US`)
      const movie = await response.json()
      console.log(movie)
      res.render("details.ejs", { movie: movie });
    } catch (err) {
      console.log(err);
    }
  },
  getWatchlist: async (req, res) => {
    try {
      const watchlist = await ToWatch.find().sort({ dateAdded: "desc" });
      res.render("watchlist.ejs", { watchlist: watchlist });
    } catch (err) {
      console.log(err);
    }
  },
  getJournal: async (req, res) => {
    try {
      const journal = await Journal.find().sort({ dateWatched: "desc" });
      res.render("journal.ejs", { journal: journal });
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
  getCustomList: async (req, res) => {
    try {
      const list = await List.findById(req.params.id);
      const comments = await Comment.find({list: req.params.id}).sort({ createdAt: "asc" });
      console.log(comments)
      res.render("customlist.ejs", { list: list, user: req.user, comments: comments });
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
  createList: async (req, res) => {
    try {
      console.log(req.body)
      await List.create({
        title: req.body.title,
        movies: [...req.body.movies],
        likes: 0,
        user: req.user.id,
        userName: req.user.userName,
      });
      console.log("List has been created!");
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
  deleteFromWatchlist: async (req, res) => {
    try {
      // Delete post from db
      await ToWatch.remove({ _id: req.params.id });
      console.log("Deleted from watchlist");
      res.redirect("/watchlist");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  deleteFromJournal: async (req, res) => {
    try {
      // Delete post from db
      await Journal.remove({ _id: req.params.id });
      console.log("Deleted from journal");
      res.redirect("/journal");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  editJournal: async (req, res) => {
    try {
      await Journal.findOneAndUpdate({ _id: req.params.id },
        { $set: {
          dateWatched: req.body.dateWatched,
          rating: req.body.rating,
          comments: req.body.comments,
          }
        }
      );
      console.log("Changes saved");
      res.redirect("/journal");
    } catch (err) {
      console.log(err);
    }
  },
};
