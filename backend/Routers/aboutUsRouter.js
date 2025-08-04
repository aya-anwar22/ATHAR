const express = require('express')
const router = express.Router();
const aboutController = require('../controllers/aboutUsController')
const authenticate = require('../middleWare/authenticate')
const upload = require('../config/multerConfig');

router.post('/' ,authenticate , upload.single('photo'), aboutController.addAbout)
router.get('/', aboutController.getAbout)
router.put('/:aboutId',authenticate, upload.single('photo'), aboutController.updateAbout)
router.delete('/:aboutId', authenticate, aboutController.deletAbout)



module.exports = router