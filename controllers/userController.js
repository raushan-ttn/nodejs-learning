

exports.getUsers = (req, res) => {
  res
    .status(200)
    .json({
      status: "SUCCESS",
      data: "Get Users page"
    });
}

exports.createUser = (req, res) => {
  res.status(201).json({
    status: "SUCCESS",
    data: {
      tour: "User created",
    }
  })
}

exports.getSingleUser = (req, res) => {
  res
    .status(200)
    .json({
      status: "SUCCESS",
      data: "Get Single User data"
    });
}

exports.updateUser = (req, res) => {
  res
    .status(200)
    .json({
      status: "SUCCESS",
      data: {
        tour: "Updated user" // Just for placeholder, no need to build whole logic here.
      }
    });
}

exports.deleteUser = (req, res) => {
  res
    .status(204)
    .json({
      status: "SUCCESS",
      data: {
        tour: "deleted user" // Just for placeholder, no need to build whole logic here.
      }
    });
}
