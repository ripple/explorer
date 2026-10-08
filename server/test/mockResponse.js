// Minimal stand-in for an Express response. Each method is chainable and records its calls.
module.exports = function mockResponse() {
  const res = {}
  res.set = jest.fn(() => res)
  res.status = jest.fn(() => res)
  res.json = jest.fn(() => res)
  return res
}
