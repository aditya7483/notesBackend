const express = require('express');
require('dotenv').config();
const router = express.Router();
const User = require('../database/schemas/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const token = process.env.JSON_SECRET

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

router.use(allowCrossDomain);

router.get('/', async (req, res) => {
    res.send('auth get/')
})

router.post('/signup', [
    body('username', 'Name is too short').isLength({ min: 3 }),
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Password is too short').isLength({ min: 5 })
], async (req, res) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
        res.status(404).json(err);
    }
    else {
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(req.body.password, salt);
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: pass
        }).then(response => {
            res.json(response)
        }
        ).catch(err => {
            res.status(404).json({ err: 'user with this username or email already exists' });
        })
    }

})


router.post('/login', [
    body('username', 'Please enter a valid email').exists(),
    body('password', 'Password is too short').exists()
], async (req, res) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
        res.status(404).json(err);
    }
    else {
        const { username, password } = req.body
        try {
            let user = await User.findOne({ username: username })
            if (!user) {
                res.status(404).json("Invalid username or password")
            }
            let passComp = await bcrypt.compare(password, user.password);
            if (!passComp) {
                res.status(404).json("Invalid username or password")
            }
            else {
                const data = {
                    user: {
                        id: user.id
                    }
                }

                const authToken = jwt.sign(data, token)
                res.json({ authToken });
            }
        } catch (err) {
            res.status(404).json("internal server error");
        }
    }
})

module.exports = router;