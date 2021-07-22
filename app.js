// External modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

// Setup app
const app = express();
const port = 4200;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// Connect mongoose to the mongoDB Atlas server
mongoose.connect('mongodb+srv://admin:admin-123@myfirstcluster.nblnt.mongodb.net/todolistDB', options, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Connection established successfully');
    }
});

// Create Post Schema (record structure)
const postsSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: [true, 'The post id is not specified']
    },
    text: {
        type: String,
        required: [true, 'The post body is not specified.']
    }
});

// Create Post Model
const Post = mongoose.model('Post', postsSchema);

const post1 = new Post({
    _id: 1,
    text: 'the text of post 1'
});

const post2 = new Post({
    _id: 2,
    text: 'the text of post 2'
});

const post3 = new Post({
    _id: 3,
    text: 'the text of post 3'
});

// Default posts
const posts = [post1, post2, post3];

// Create List Schema (record structure)
const listSchema = new mongoose.Schema({
    name: String,
    items: [postsSchema]
});

// Create List Model
const List = mongoose.model('List', listSchema);

// Handle homepage
app.get('/', function (req, res) {
    // docs: document objects
    Post.find({}, ((err, foundItems) => {
        if (err) {
            console.error(err);
        } else {
            if (foundItems.length === 0) {
                Post.insertMany(posts, {}, (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('Posts inserted successfully');
                    }
                });
                // once the items are added to the DB, recurse and render the list.
                res.redirect('/');
            } else {
                res.render('list', {listTitle: 'Today', newListItems: foundItems});
            }
        }
    }));
});

// Helper functions
function getId() {
    return ++posts.length;
}

app.post('/', function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const formPost = new Post({
        _id: getId(),
        text: itemName
    });

    if (listName === 'Today') {
        formPost.save();
        res.redirect('/');
    } else {
        List.findOne({name: listName}, {}, {}, ((err, foundItem) => {

            if (!err) {
                foundItem.items.push(formPost);
                foundItem.save();
                res.redirect('/' + listName);
            } else {
                console.log(err);
            }
        }));
    }
});

app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkboxValue;
    const listName = req.body.listName;

    // Post.deleteOne({_id: checkedItemId}, {}, err => {
    //     console.error(err);
    // });
    if (listName === 'Today') {
        Post.findByIdAndRemove(checkedItemId, {}, (err) => {
            if (!err) {
                res.redirect('/');
            }
        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, {}, (err, foundList) => {
            if (!err) {
                res.redirect('/' + listName);
            } else {
                console.error(err);
            }
        });
    }
});

// handle custom routes
app.get(`/:customListName`, function (req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, {}, {}, ((err, foundItem) => {
        if (!err) {
            if (!foundItem) {
                // create new list
                const list = new List({
                    name: customListName,
                    items: posts
                });
                list.save();
                res.redirect('/' + customListName);
            } else {
                // show existing list
                res.render('list', {listTitle: foundItem.name, newListItems: foundItem.items});
            }
        } else {
            console.log(err);
        }
    }));
});

app.get('/about', function (req, res) {
    res.render('about');
});

app.listen(process.env.PORT || port, () => {
    console.log(`Server started on port ${port}`);
});