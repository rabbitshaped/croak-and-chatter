import express from "express";
import bodyParser from "body-parser";
import comments from "./comments.js";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// NEW COMMENT
app.post("/submit", (req, res) => {
	const { author, title, comment } = req.body;
	if (!comment) return res.redirect("/");

	// create new comment object using already destructured variables above
	const newComment = { author, title, comment };

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
	res.render("index", { comments, commentToEdit, index });
});

// SAVE COMMENT
app.post("/save", (req, res) => {
	const index = req.body.editIndex;
	comments[index] = {
		author: req.body.author,
		title: req.body.title,
		comment: req.body.comment,
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
	res.render("index", { comments, commentToEdit, index });
});

app.get("/about", (req, res) => {
	res.render("about");
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
