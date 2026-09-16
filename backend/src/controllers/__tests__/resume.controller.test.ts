import { Request, Response } from 'express';

// Mock env before importing controllers that load it
jest.mock('../../config/env', () => ({
  config: { redisUrl: 'redis://localhost:6379' }
}));

import { getSharedResume } from '../resume.controller';
import Resume from '../../models/Resume';
import Analysis from '../../models/Analysis';

jest.mock('../../models/Resume');
jest.mock('../../models/Analysis');

describe('Resume Controller - getSharedResume', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = { params: { token: 'test-token' } };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should not leak _id or userId in the response', async () => {
    const mockResume = {
      _id: 'secret-mongo-id',
      userId: 'secret-user-id',
      originalName: 'test.pdf',
      status: 'completed',
      createdAt: new Date(),
    };

    const mockAnalysis = {
      _id: 'secret-analysis-id',
      resumeId: 'secret-mongo-id',
      atsScore: 85,
      summary: 'Good',
    };

    (Resume.findOne as jest.Mock).mockResolvedValue(mockResume);
    (Analysis.findOne as jest.Mock).mockResolvedValue(mockAnalysis);

    await getSharedResume(mockRequest as Request, mockResponse as Response);

    expect(Resume.findOne).toHaveBeenCalledWith({ shareToken: 'test-token' });
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    const jsonResponse = (mockResponse.json as jest.Mock).mock.calls[0][0];
    
    // Check fields are present
    expect(jsonResponse.resume.originalName).toBe('test.pdf');
    expect(jsonResponse.analysis.atsScore).toBe(85);

    // Verify sensitive data is NOT present
    expect(jsonResponse.resume._id).toBeUndefined();
    expect(jsonResponse.resume.userId).toBeUndefined();
    expect(jsonResponse.analysis._id).toBeUndefined();
    expect(jsonResponse.analysis.resumeId).toBeUndefined();
  });
});
