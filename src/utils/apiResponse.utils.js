const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    status: 'succes',
    message,
    data,
  });
};

const sendPaginatedResponse = (
  res,
  statusCode,
  message,
  data = [],
  { page, limit, totalItem }
) => {
  const currentPage = Number(page);
  const currentLimit = Number(limit);
  const totalPages = Math.ceil(totalItem / currentLimit);

  return res.status(statusCode).json({
    status: 'succes',
    message,
    data,
    pagination: {
      pages: currentPage,
      limit: currentLimit,
      totalItem,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  });
};

export { sendResponse, sendPaginatedResponse };
