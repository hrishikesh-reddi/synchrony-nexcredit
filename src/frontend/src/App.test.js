import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { getAuditLogs, getCreditApplications, getHealth, login } from './Client';

jest.mock('./Client', () => ({
  getAllStudents: jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) })),
  getCreditApplications: jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) })),
  getAuditLogs: jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) })),
  getHealth: jest.fn(() => Promise.resolve({ status: 'UP' })),
  login: jest.fn(() => Promise.resolve({ token: 'test-token', username: 'underwriter', roles: ['UNDERWRITER'] })),
  setAuthToken: jest.fn(),
  analyzeCreditApplication: jest.fn(),
  createCreditApplication: jest.fn(),
}));

test('introduces NexCredit before opening the live workbench', async () => {
  login.mockResolvedValue({ token: 'test-token', username: 'underwriter', roles: ['UNDERWRITER'] });
  getHealth.mockResolvedValue({ status: 'UP' });
  getCreditApplications.mockReturnValue(Promise.resolve({ json: () => Promise.resolve([]) }));
  getAuditLogs.mockReturnValue(Promise.resolve({ json: () => Promise.resolve([]) }));
  render(<App />);
  expect((await screen.findAllByText(/NexCredit AI/i)).length).toBeGreaterThan(0);
  expect(await screen.findByRole('heading', { name: /Credit decisions with context/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Architecture you can explain/i })).toBeInTheDocument();
  expect(screen.queryByText(/Priya Sharma/i)).not.toBeInTheDocument();
  expect(await screen.findByText(/Open live workbench/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Open live workbench/i));
  expect(await screen.findByRole('heading', { name: /Credit decision operations/i })).toBeInTheDocument();
  expect(screen.getByText(/Concept preview/i)).toBeInTheDocument();
  expect(screen.getByText('Deterministic policy', { selector: 'strong' })).toBeInTheDocument();
  expect(screen.queryByText(/Good morning, analyst/i)).not.toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: /Workbench navigation/i })).toBeInTheDocument();
  expect(screen.getByText('Applications', { selector: 'span' })).toBeInTheDocument();
  expect(screen.getByText(/API live/i)).toBeInTheDocument();
});

test('does not claim the API is live when the health request fails', async () => {
  login.mockResolvedValue({ token: 'test-token', username: 'underwriter', roles: ['UNDERWRITER'] });
  getHealth.mockRejectedValue(new Error('API unavailable'));
  getCreditApplications.mockReturnValue(Promise.resolve({ json: () => Promise.resolve([]) }));
  getAuditLogs.mockReturnValue(Promise.resolve({ json: () => Promise.resolve([]) }));

  render(<App />);
  fireEvent.click(await screen.findByText(/Open live workbench/i));

  expect(await screen.findByText(/API offline/i)).toBeInTheDocument();
  expect(screen.queryByText(/API live/i)).not.toBeInTheDocument();
});
