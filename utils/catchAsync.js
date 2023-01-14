// OLD WAY.
// module.exports = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   }
// };

// NEW WAY: Basically this function accept a async function, and return/call -
// this function automatically and handle catch block.
// with this wapper function we can replace/remobe all catch block for all async functions.

module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
