module.exports = (model, options = {}) => async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;
  const sortBy = req.query.sort || '-createdAt';
  const search = req.query.search || '';
  const searchField = options.searchField || null;
  const selectFields = options.select || '';

  const filters = { ...req.query };
  delete filters.page;
  delete filters.limit;
  delete filters.sort;
  delete filters.search;

  try {
    let baseFilter = { ...filters };

    if (search && searchField) {
      baseFilter[searchField] = new RegExp(search, 'i');
    }

    const activeFilter = { ...baseFilter, isDeleted: false };
    const deletedFilter = { ...baseFilter, isDeleted: true };

    const [activeDocs, totalActive] = await Promise.all([
      model.find(activeFilter).skip(skip).limit(limit).sort(sortBy).select(selectFields),
      model.countDocuments(activeFilter),
    ]);

    const [deletedDocs, totalDeleted] = await Promise.all([
      model.find(deletedFilter).skip(skip).limit(limit).sort(sortBy).select(selectFields),
      model.countDocuments(deletedFilter),
    ]);

    res.paginateMiddleWare = {
      active: {
        total: totalActive,
        currentPage: page,
        totalPages: Math.ceil(totalActive / limit),
        dataActive: activeDocs,
        query: activeFilter // ✅ أضفنا الـ query هنا
      },
      deleted: {
        total: totalDeleted,
        currentPage: page,
        totalPages: Math.ceil(totalDeleted / limit),
        dataDeleted: deletedDocs,
        query: deletedFilter // ✅ أضفنا الـ query هنا
      }
    };

    next();
  } catch (error) {
    next(error);
  }
};
