// frontend/tests/unit/test_auth.js
// Simple unit tests for authentication service

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

global.localStorage = localStorageMock;

describe('Authentication Service', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('should return token if exists in localStorage', () => {
    localStorageMock.getItem.mockReturnValue('mock-token');
    
    const { getToken } = require('../../src/services/auth');
    const token = getToken();
    
    expect(token).toBe('mock-token');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
  });

  test('should return null if no token in localStorage', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { getToken } = require('../../src/services/auth');
    const token = getToken();
    
    expect(token).toBeNull();
  });

  test('should check if user is authenticated correctly', () => {
    localStorageMock.getItem.mockReturnValue('mock-token');
    
    const { isAuthenticated } = require('../../src/services/auth');
    const authenticated = isAuthenticated();
    
    expect(authenticated).toBe(true);
  });
});