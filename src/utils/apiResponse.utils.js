const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

const sendPaginatedResponse = (
  res,
  statusCode,
  message,
  data = [],
  { page, limit, totalItem } = {}
) => {
  const currentPage = Number(page);
  const currentLimit = Number(limit);
  const totalPages = currentLimit > 0 ? Math.ceil(totalItem / currentLimit) : 0;

  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
    pagination: {
      page: currentPage,
      limit: currentLimit,
      totalItem,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  });
};

export { sendResponse, sendPaginatedResponse };
