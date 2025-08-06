const express = require('express');
const router = express.Router();
const collectionsControllers = require('../controllers/collectionsControllers.js');
const authenticate = require('../middleWare/authenticate.js');
const upload = require('../config/multerConfig.js');
const authorize = require('../middleWare/role.middleWare.js');
const Collections = require('../models/Collections.js');
const paginateMiddleWare = require('../middleWare/paginate.middleWare.js');

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.single('collectionsImage'),
  collectionsControllers.addCollections
);

router.get(
  '/get-by-admin',
  authenticate,
  authorize('admin'),
  paginateMiddleWare(Collections, {
    searchField: 'collectionsName',
  }),
  collectionsControllers.getAllCollectionsByAdmin
);

router.get(
  '/get-by-admin/:slug',
  authenticate,
  authorize('admin'),
  collectionsControllers.getCollectionBySlugByAdmin
);

router.patch(
  '/:slug',
  authenticate,
  authorize('admin'),
  upload.single('collectionsImage'),
  collectionsControllers.updateCollection
);

router.delete(
  '/:slug',
  authenticate,
  authorize('admin'),
  collectionsControllers.deleteCollection
);

// User routes
router.get(
  '/',
  paginateMiddleWare(Collections, {}),
  collectionsControllers.getAllCollections
);

router.get(
  '/:slug',
  collectionsControllers.getCollectionBySlug
);

module.exports = router;
