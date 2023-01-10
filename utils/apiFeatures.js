class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filters() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((el) => { delete queryObj[el]; });

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      // multiple sort togather.
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-duration');
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
      // prefix minus (-) excludes this fields.
      // if we select/deselect 3 fields pass minus (-) for all not only one
      // (/nitours/v1/tours?fields=-price,-ratingsAverage,-name)
    }
    return this;
  }

  pagination() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;

    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
