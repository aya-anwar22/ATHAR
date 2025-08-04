const express = require('express')
const router = express.Router();
const contactUs = require('../controllers/contactUs')
const authenticate = require('../middleWare/authenticate')

router.post('/', contactUs.contactUs)
router.get('/', authenticate, contactUs.getAllMessage)
router.post('/reply-admin', authenticate, contactUs.replyToMessage)

module.exports = router