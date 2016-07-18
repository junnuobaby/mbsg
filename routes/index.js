var express = require('express');
var router = express.Router();
var letter = require('../models/letter');
var user = require('../models/user');

var Letter = letter.Letter;
var User = user.User;


router.get('/', function(req, res) {
    res.render('login', {title: "情书"});
});


router.post('/login', function(req, res) {
    var girl = req.body.girl;
    var boy = req.body.boy;
    var token = req.body.token;
    var user = {
        girl: girl,
        boy: boy,
        token: token
    };

    User.findOne(user, function (err, user) {
        if(err) {
            return res.json({err:err});
        }
        if(!user) {
            res.render('login', {error: "用户不存在"});
        }
        else {
            req.session.user = {
                girl: user.girl,
                boy: user.boy,
                token: user.token,
                _id: user._id
            };
            req.session.save(function (err) {
                res.redirect('/index');
            });
        }
    });
});


router.get('/index', function(req, res) {
    var user_session = req.session.user;
    if (user_session) {
        Letter.findOne({owner:user_session._id}).sort({'date':-1}).exec(function (err, doc) {
            res.render('index', {title: "情书", letter:doc});
        });
    }else {
        res.redirect('/');
    }
});


router.post('/write', function(req, res) {
    var title = req.body.title;
    var content = req.body.content;
    var user = req.session.user;
    var letter = new Letter({
        title: title,
        content: content,
        owner: user._id
    });

    letter.save(function (err) {
        if(err) {
            console.log(err);
        }
        User.findOne(user).exec(function (err, doc) {
            doc.letters.push(letter._id);
            doc.save(function (err) {
                res.redirect('/index');
            });
        });
    });
});


router.get('/read', function (req, res) {
    var user_session = req.session.user;
    Letter.find({owner: user_session._id}).sort({'date':-1}).exec(function (err, doc) {
        res.json(doc);
    });
});


router.get('/letter/:letter_id', function (req, res) {
    var letter_id = req.params.letter_id;
    Letter.findOne({_id: letter_id}).exec(function (err, doc) {
        res.json(doc);
    });
});


router.get('/next/:letter_id', function (req, res) {
    var letter_id = req.params.letter_id;
    var user = req.session.user;
    User.findOne(user).exec(function (err, doc) {
        var letter_list = doc.letters;
        var index = letter_list.indexOf(letter_id);
        if (index == 0){
            Letter.findOne({_id: letter_id}).exec(function (err, doc) {
                res.json(doc);
            });
        }
        else {
            Letter.findOne({_id: letter_list[index-1]}).exec(function (err, doc) {
                res.json(doc);
            });
        }
    });
});


router.get('/previous/:letter_id', function (req, res) {
    var letter_id = req.params.letter_id;
    var user = req.session.user;
    User.findOne(user).exec(function (err, doc) {
        var letter_list = doc.letters;
        var index = letter_list.indexOf(letter_id);
        if (index == letter_list.length-1){
            Letter.findOne({_id: letter_id}).exec(function (err, doc) {
                res.json(doc);
            });
        }
        else {
            Letter.findOne({_id: letter_list[index+1]}).exec(function (err, doc) {
                res.json(doc);
            });
        }
    });
});


router.post('/register', function (req, res) {
    var girl = req.body.girl;
    var boy = req.body.boy;
    var token = req.body.token;

    var register_form = {
        girl: girl,
        boy: boy,
        token: token
    };

    User.findOne(register_form, function (err, user) {
        if(user) {
            console.log("注册失败，用户已经存在，请重新填写");
            res.render('login', {error: "注册失败，用户已经存在，请重新填写"});
        }else {
            var new_user = new User(register_form);
            new_user.save(function (err) {
                if(err) {
                    console.log(err);
                }
                console.log("注册成功，请登录");
                res.render('login', {success: "注册成功，请登录"});
            });
        }
    });
});

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if(err) console.log(err);
        res.redirect('/');
    });
});

module.exports = router;