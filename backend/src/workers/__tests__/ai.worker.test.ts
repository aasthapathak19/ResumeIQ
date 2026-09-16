// Mock env before importing workers that load it
jest.mock('../../config/env', () => ({
  config: { redisUrl: 'redis://localhost:6379' }
}));

import { QueueEvents, Job } from 'bullmq';
import Resume from '../../models/Resume';
import { startAiWorker } from '../ai.worker';
import Redis from 'ioredis';

jest.mock('bullmq');
jest.mock('ioredis');
jest.mock('../../models/Resume');
jest.mock('../../models/Analysis');

describe('AI Worker - Retry Exhaustion', () => {
  let mockQueueEventsOn: jest.Mock;

  beforeEach(() => {
    mockQueueEventsOn = jest.fn();
    (QueueEvents as unknown as jest.Mock).mockImplementation(() => ({
      on: mockQueueEventsOn,
    }));
    
    const { Worker } = require('bullmq');
    (Worker as jest.Mock).mockImplementation(() => ({
      opts: { connection: {} },
      on: jest.fn(),
      close: jest.fn()
    }));

    (Job.fromId as jest.Mock).mockResolvedValue({
      id: 'job-123',
      data: { resumeId: 'mongo-id' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update Resume status to failed when QueueEvents emits failed event', async () => {
    // Start the worker to register the listeners
    startAiWorker();

    // Find the 'failed' event handler
    const failedHandlerCall = mockQueueEventsOn.mock.calls.find(call => call[0] === 'failed');
    expect(failedHandlerCall).toBeDefined();

    const failedHandler = failedHandlerCall[1];

    // Simulate BullMQ firing the failed event after all retries are exhausted
    await failedHandler({ jobId: 'job-123', failedReason: 'Timeout' });

    // Verify that the job was fetched and the resume status was updated
    expect(Job.fromId).toHaveBeenCalledWith(expect.anything(), 'job-123');
    expect(Resume.findByIdAndUpdate).toHaveBeenCalledWith('mongo-id', { status: 'failed' });
  });
});
