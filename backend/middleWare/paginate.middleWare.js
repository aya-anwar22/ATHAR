module.exports = (model, options = {}) => async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sort || '-createdAt';
  const search = req.query.search || '';

  const searchRegex = new RegExp(search, 'i');
  const searchField = options.searchField || 'userName';
  const selectFields = options.select || '';

  // لو جالك categoryId في الكويري
  const categoryId = req.query.category;

  try {
    let baseFilter = search
      ? { [searchField]: searchRegex }
      : {};

    if (categoryId) {
      baseFilter = { ...baseFilter, categoryId };
    }

    const activeFilter = { ...baseFilter, isDeleted: false };
    const deletedFilter = { ...baseFilter, isDeleted: true };

    const [activeUsers, totalActive] = await Promise.all([
      model.find(activeFilter)
        .skip(skip)
        .limit(limit)
        .sort(sortBy)
        .select(selectFields),
      model.countDocuments(activeFilter),
    ]);

    const [deletedUsers, totalDeleted] = await Promise.all([
      model.find(deletedFilter)
        .skip(skip)
        .limit(limit)
        .sort(sortBy)
        .select(selectFields),
      model.countDocuments(deletedFilter),
    ]);

    res.paginateMiddleWare = {
      active: {
        total: totalActive,
        currentPage: page,
        totalPages: Math.ceil(totalActive / limit),
        dataActive: activeUsers
      },
      deleted: {
        total: totalDeleted,
        currentPage: page,
        totalPages: Math.ceil(totalDeleted / limit),
        dataDeleted: deletedUsers
      }
    };

    next();
  } catch (error) {
    next(error);
  }
};
