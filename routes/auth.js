const express = require('express');
const router = express.Router();
const User = require('../database/schemas/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
require('dotenv').config();
var jwt = require('jsonwebtoken');
const token = process.env.JSON_KEY

router.get('/', async (req, res) => {

    res.send('auth get/')
})

router.post('/', [
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

module.exports = router;