const express = require('express');
require('dotenv').config();
const router = express.Router();
const User = require('../database/schemas/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const token = process.env.JSON_SECRET

router.get('/', async (req, res) => {
    res.send('auth get/')
})

router.post('/signup', [
    body('name', 'Name is too short').isLength({ min: 3 }),
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Password is too short').isLength({ min: 5 })
], async (req, res) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
        res.status(404).json({ err: err.array() });
    }
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(req.body.password, salt);
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: pass
    }).then(response => {
        res.json(response)
    }
    ).catch(err => {
        res.json({ err: 'A user with this email already exists' });
    })

})


router.get('/login', [
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Password is too short').exists()
], async (req, res) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
        res.status(404).json({ err: err.array() });
    }
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email: email })
        if (!user) {
            res.status(404).json("Invalid username or password")
        }
        let passComp = await bcrypt.compare(password, user.password);
        if (!passComp) {
            res.status(404).json("Invalid username or password")
        }
        else
        {const data = {
            user:{
                id: user.id
            }
        }

        const authToken = jwt.sign(data, token)
        res.json({ authToken });}
    } catch (err) {
        res.status(404).json("internal server error");
    }
})

module.exports = router;