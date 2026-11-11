const geolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(() => 1),
  clearWatch: jest.fn(),
  stopObserving: jest.fn(),
};

module.exports = {
  __esModule: true,
  default: geolocation,
};
