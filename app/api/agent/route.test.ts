import { describe, it, expect, mock, spyOn, beforeEach } from 'bun:test';

const streamTextMock = mock();
mock.module('ai', () => ({
  streamText: streamTextMock
}));

const groqMock = mock();
mock.module('@ai-sdk/groq', () => ({
  groq: groqMock
}));

import { POST, maxDuration } from './route.ts';

describe('POST /api/agent', () => {
  let consoleErrorSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    streamTextMock.mockReset();
    groqMock.mockReset();
    // suppress console.error in tests to avoid noisy output for expected errors
    consoleErrorSpy = spyOn(console, 'error').mockImplementation(() => {});
    consoleErrorSpy.mockClear();
  });

  it('exports correct maxDuration', () => {
    expect(maxDuration).toBe(30);
  });

  it('should successfully return a stream response with correct parameters', async () => {
    const mockDataStreamResponse = new Response('mock stream', { status: 200 });
    streamTextMock.mockResolvedValueOnce({
      toDataStreamResponse: () => mockDataStreamResponse
    });
    groqMock.mockReturnValueOnce('mock-groq-model');

    const messages = [{ role: 'user', content: 'hello' }];
    const req = new Request('http://localhost/api/agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, sessionId: '123' })
    });

    const res = await POST(req);

    expect(res).toBe(mockDataStreamResponse);
    expect(res.status).toBe(200);

    expect(groqMock).toHaveBeenCalledWith('llama-3.1-70b-versatile');
    expect(streamTextMock).toHaveBeenCalledTimes(1);

    const callArgs = streamTextMock.mock.calls[0][0];
    expect(callArgs.model).toBe('mock-groq-model');
    expect(callArgs.messages).toEqual(messages);
    expect(callArgs.maxSteps).toBe(10);
    expect(callArgs.temperature).toBe(0.3);
    // ensure tools are passed
    expect(callArgs.tools).toBeDefined();
    // ensure system prompt is there
    expect(typeof callArgs.system).toBe('string');
    expect(callArgs.system).toContain('Dr. Bev');
    // ensure onFinish exists
    expect(typeof callArgs.onFinish).toBe('function');
  });

  it('should return a 500 response on streamText error', async () => {
    const error = new Error('Stream text error');
    streamTextMock.mockRejectedValueOnce(error);

    const req = new Request('http://localhost/api/agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] })
    });

    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(res.headers.get('Content-Type')).toBe('application/json');
    expect(await res.json()).toEqual({ error: 'Failed to process request' });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Agent error:', error);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a 500 response on invalid JSON request body', async () => {
    const req = new Request('http://localhost/api/agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{ invalid_json '
    });

    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Failed to process request' });

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(streamTextMock).not.toHaveBeenCalled();
  });
});
