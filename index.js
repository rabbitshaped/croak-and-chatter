import express from "express";
import bodyParser from "body-parser";
import comments from "./comments.js";

const app = express();
const port = process.env.PORT || 3000;
const COMMENT_MAX_LENGTH = 220;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// NEW COMMENT
app.post("/submit", (req, res) => {
	const { author, title, comment } = req.body;
	if (!comment?.trim()) return res.redirect("/");

	// create new comment object using already destructured variables above
	const newComment = {
		author,
		title,
		comment: comment.slice(0, COMMENT_MAX_LENGTH),
	};

	console.log("Before adding:", comments);
	// newest item goes first. same as push but reverse
	comments.unshift(newComment);
	console.log("After adding:", comments);
	res.redirect("/");
});

// EDIT COMMENT
app.post("/edit", (req, res) => {
	const index = req.body.editIndex;
	const commentToEdit = comments[index];
	res.render("index", { comments, commentToEdit, index, page: "home" });
});

// SAVE COMMENT
app.post("/save", (req, res) => {
	const index = req.body.editIndex;
	comments[index] = {
		author: req.body.author,
		title: req.body.title,
		comment: String(req.body.comment || "").slice(0, COMMENT_MAX_LENGTH),
	};
	console.log("After saving:", comments);
	res.redirect("/");
});

// DELETE COMMENT
app.post("/delete", (req, res) => {
	const index = req.body.commentIndex;
	comments.splice(index, 1);
	console.log("After deleting:", comments);
	res.redirect("/");
});

app.get("/", (req, res) => {
	const commentToEdit = null;
	const index = null;
	res.render("index", { comments, commentToEdit, index, page: "home" });
});

app.get("/lost-and-found", (req, res) => {
	res.render("lost-and-found", { page: "lost-and-found" });
});

app.get("/pond-etiquette", (req, res) => {
	res.render("pond-etiquette", { page: "pond-etiquette" });
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
