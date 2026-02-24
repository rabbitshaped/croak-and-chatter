import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

let comments = [
	{
		author: "Anonymous Frog #18",
		title: "I sat on a warm rock and now I miss it",
		comment: `Does anyone else think about the rock they used to sit on? It was flat. It was warm. I fear I will never feel joy like that again.`,
	},
	{
		author: "Old Toad",
		title: "Toad opinion: flies are better when they struggle a little",
		comment: `If the fly simply accepts its fate, where is the sport? I am not saying suffering is good. I am saying it adds texture.`,
	},
	{
		author: "Flopsy Frog",
		title: "I tried flying",
		comment: `Jumped off a lily pad. Landed on my face. Gravity is a cruel mistress.`,
	},
	{
		author: "Anonymous Frog #17",
		title: "Fly philosophy",
		comment: `Are we catching flies, or are flies choosing to be caught?`,
	},
	{
		author: "Pondering Frog",
		title: "The meaning of mud",
		comment: `I like mud. Mud likes me. Maybe that’s all we need.`,
	},
	{
		author: "Thirsty Toad",
		title: "Morning dew",
		comment: `Nothing beats drinking dew at sunrise. It’s like nature’s coffee.`,
	},
];

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
