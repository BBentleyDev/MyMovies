const ToWatch = require("../models/ToWatch");
const Journal = require("../models/Journal");
const Comment = require("../models/Comment");
const List = require("../models/List");
const baseUrl = 'https://api.themoviedb.org/3/';


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
        user: req.user.id,
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
      res.render("searchResults.ejs", { movies: movies.results });
    } catch (err) {
      console.log(err);
    }
  },
  getDetails: async (req, res) => {
    try {

      //needs fixing for conditional buttons, maybe create title arrays on client side, as the full watchlist/journal objects need to be passed so id is accesible for delete operation to work
      let watchlistTitles = []
      let journalTitles = []

      const watchlist = await ToWatch.find();
      const journal = await Journal.find();

      watchlist.forEach( movie => watchlistTitles.push(movie.title))
      journal.forEach( movie => journalTitles.push(movie.title))

      const response = await fetch(`${baseUrl}movie/${req.params.id}?api_key=${process.env.API_KEY}&language=en-US`)
      const movie = await response.json()
      res.render("details.ejs", { movie: movie, journal: journal, watchlist: watchlist});
    } catch (err) {
      console.log(err);
    }
  },
  getWatchlist: async (req, res) => {
    try {
      let watchlist = await ToWatch.find().sort({ dateAdded: "desc" });
      // watchlist = watchlist.filter(movie => movie.user == req.params.id)
      res.render("watchlist.ejs", { watchlist: watchlist, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getJournal: async (req, res) => {
    try {
      const journal = await Journal.find().sort({ dateWatched: "desc" });
      res.render("journal.ejs", { journal: journal, user: req.user });
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
