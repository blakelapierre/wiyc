// controllers/lib/paginator.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

function Paginator (req) {
  this.req = req;
  this.page = req.query.p || 1;
  this.countPerPage = req.query.cpp|| 25;
}

Paginator.prototype.paginateQuery = function (query) {
  return query
  .skip((this.page - 1) * this.countPerPage)
  .limit(this.countPerPage);
};

module.exports = Paginator;
