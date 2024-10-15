const { SuccessResponse, ErrorResponse, customError } = require('../../src/utils/response');

describe('Response Utils', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('SuccessResponse', () => {
    test('should set correct status and data with default parameters', () => {
      SuccessResponse(mockRes, {});
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: '',
        statusCode: 200,
        data: {}
      });
    });

    test('should set custom message, data, and code', () => {
      SuccessResponse(mockRes, { message: 'Success', data: { id: 1 }, code: 201 });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
        statusCode: 201,
        data: { id: 1 }
      });
    });

    test('should return lean response when lean is true', () => {
      SuccessResponse(mockRes, { message: 'Lean', data: { id: 1 }, code: 200, lean: true });
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Lean',
        statusCode: 200,
        id: 1
      });
    });
  });

  describe('ErrorResponse', () => {
    test('should set correct status and error message', () => {
      ErrorResponse(mockRes, { error: 'Test error' });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 500,
        message: '',
        error: 'Test error'
      });
    });

    test('should use custom status code if provided', () => {
      ErrorResponse(mockRes, { error: { status: 400, message: 'Bad request' } });
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 400,
        message: '',
        error: 'Bad request'
      });
    });

    test('should use custom code if provided', () => {
      ErrorResponse(mockRes, { error: { customCode: 1001, message: 'Custom error' } });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 1001,
        message: '',
        error: 'Custom error'
      });
    });

    test('should use error detail if provided', () => {
      ErrorResponse(mockRes, { error: { detail: 'Detailed error' } });
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Detailed error'
      }));
    });

    test('should include custom message if provided', () => {
      ErrorResponse(mockRes, { error: 'Error', message: 'Custom message' });
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Custom message',
        error: 'Error'
      }));
    });
  });

  describe('customError', () => {
    let consoleErrorSpy;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    test('should create error with custom properties', () => {
      expect(() => {
        customError({ code: 400, message: 'Bad Request', customCode: 1001, metadata: { field: 'test' } });
      }).toThrow('Bad Request');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Bad Request', 'error', { field: 'test' });
    });

    test('should set default properties on error object', () => {
      try {
        customError({ message: 'Test Error' });
      } catch (error) {
        expect(error.message).toBe('Test Error');
        expect(error.expose).toBe(true);
      }
    });
  });
});