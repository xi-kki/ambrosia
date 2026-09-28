import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../../../app/api/contact/route';
import { Resend } from 'resend';

// Mock the resend library
vi.mock('resend', () => {
  const mockSend = vi.fn();
  return {
    Resend: vi.fn().mockImplementation(function() {
      return {
        emails: {
          send: mockSend
        }
      };
    })
  };
});

describe('Contact API Error Handling', () => {
  const mockPayload = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    company: 'Test Co',
    role: 'Developer',
    inquiry: 'General',
    message: 'Hello'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'test_key';
  });

  it('handles invalid JSON gracefully', async () => {
    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: 'invalid json'
    });

    // Suppress console.error during this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data).toEqual({ error: 'Internal server error' });

    consoleSpy.mockRestore();
  });

  it('handles resend throw error correctly', async () => {
    const mockSend = vi.fn().mockRejectedValue(new Error('Resend failed'));
    (Resend as any).mockImplementation(function() {
      return {
        emails: { send: mockSend }
      };
    });

    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(mockPayload)
    });

    // Suppress console.error during this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data).toEqual({ error: 'Internal server error' });
    expect(consoleSpy).toHaveBeenCalledWith('Contact API error:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('handles missing fields', async () => {
    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({})
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ error: 'Missing required fields' });
  });

  it('handles invalid email format', async () => {
    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        ...mockPayload,
        email: 'invalid-email'
      })
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ error: 'Invalid email' });
  });

  it('handles resend returning error object', async () => {
    const mockSend = vi.fn().mockResolvedValue({ data: null, error: new Error('Resend returned error') });
    (Resend as any).mockImplementation(function() {
      return {
        emails: { send: mockSend }
      };
    });

    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(mockPayload)
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to send email' });
    expect(consoleSpy).toHaveBeenCalledWith('Resend error:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('handles successful submission when mock key is used', async () => {
    delete process.env.RESEND_API_KEY;
    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(mockPayload)
    });

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.simulated).toBe(true);

    consoleSpy.mockRestore();
  });

  it('handles successful submission with actual resend call', async () => {
    const mockSend = vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null });
    (Resend as any).mockImplementation(function() {
      return {
        emails: { send: mockSend }
      };
    });

    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(mockPayload)
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.id).toBe('mock-id');
    expect(mockSend).toHaveBeenCalledTimes(2);
  });
});
