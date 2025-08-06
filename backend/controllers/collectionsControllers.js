const cloudinary = require('../config/cloudinary');
const slugify = require('slugify');
const Collections = require('../models/Collections');
const asyncHandler = require('express-async-handler');

// for admin
exports.addCollections = asyncHandler(async (req, res) => {
    const { collectionsName } = req.body;

    try {
        const collectionsSlug = slugify(collectionsName, { lower: true });

        // Check if collection with the same name or slug already exists
        const existingCollection = await Collections.findOne({ collectionsSlug });
        if (existingCollection) {
            return res.status(400).json({
                message: "Collection name already exists. Please choose a different name."
            });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'collections'
        });

        const newCollection = await Collections.create({
            collectionsName,
            collectionsSlug,
            collectionsImage: result.secure_url
        });

        res.status(201).json({
            message: "Collection created successfully",
            collection: newCollection
        });
    } catch (error) {
        console.error('Error creating collection:', error);
        return res.status(500).json({ message: "Error creating collection" });
    }
});


exports.getAllCollectionsByAdmin = asyncHandler(async (req, res) => {
    return res.status(200).json({
        activeCollections: res.paginateMiddleWare.active,
        deletedCollections: res.paginateMiddleWare.deleted
    });
});


// Get collection by slug (admin)
exports.getCollectionBySlugByAdmin = asyncHandler(async (req, res) => {
    const slug = req.params.slug;

    const collection = await Collections.findOne({ collectionsSlug: slug });
    if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
    }

    return res.status(200).json({ collection });
});

// Update collection by slug (admin)
exports.updateCollection = asyncHandler(async (req, res) => {
    const slug = req.params.slug;
    const { collectionsName } = req.body;

    const collection = await Collections.findOne({ collectionsSlug: slug });
    if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
    }

    try {
        const newSlug = slugify(collectionsName, { lower: true });

        // Check if another collection already has the same slug
        const existingCollection = await Collections.findOne({ 
            collectionsSlug: newSlug, 
            _id: { $ne: collection._id } // exclude the current collection
        });

        if (existingCollection) {
            return res.status(400).json({
                message: "Another collection with this name already exists. Please choose a different name."
            });
        }

        let imageUrl = collection.collectionsImage;

        if (req.file && req.file.path) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'collections'
            });
            imageUrl = result.secure_url;
        }

        const updatedCollection = await Collections.findByIdAndUpdate(
            collection._id,
            {
                collectionsName,
                collectionsSlug: newSlug,
                collectionsImage: imageUrl
            },
            { new: true }
        );

        res.status(200).json({
            message: "Collection updated successfully",
            collection: updatedCollection
        });
    } catch (error) {
        console.error('Error updating collection:', error);
        return res.status(500).json({ message: "Error updating collection" });
    }
});


// Soft delete / restore by slug (admin)
exports.deleteCollection = asyncHandler(async (req, res) => {
    const slug = req.params.slug;

    const collection = await Collections.findOne({ collectionsSlug: slug });
    if (!collection) {
        return res.status(404).json({ message: 'Collection not found' });
    }

    if (collection.isDeleted) {
        collection.isDeleted = false;
        collection.deletedAt = null;
        collection.deletedBy = null;
        await collection.save();
        return res.status(200).json({ message: 'Collection restored successfully' });
    }

    collection.isDeleted = true;
    collection.deletedAt = new Date();
    collection.deletedBy = req.user._id;

    await collection.save();

    res.status(200).json({ message: 'Collection soft-deleted successfully' });
});


// for user
exports.getAllCollections = asyncHandler(async (req, res) => {
    return res.status(200).json({
        activeCollections: res.paginateMiddleWare.active
    });
});


// Get collection by slug (user)
exports.getCollectionBySlug = asyncHandler(async (req, res) => {
    const slug = req.params.slug;

    const collection = await Collections.findOne({
        collectionsSlug: slug,
        isDeleted: false
    }).select('-isDeleted -deletedAt -deletedBy');

    if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
    }

    return res.status(200).json({ collection });
});
