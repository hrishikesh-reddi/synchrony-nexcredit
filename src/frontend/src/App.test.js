import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { getAuditLogs, getCreditApplications, login } from './Client';

jest.mock('./Client', () => ({
  getCreditApplications: jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) })),
  getAuditLogs: jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) })),
  login: jest.fn(() => Promise.resolve({ token: 'test-token', username: 'underwriter', roles: ['UNDERWRITER'] })),
  setAuthToken: jest.fn(),
  analyzeCreditApplication: jest.fn(),
  createCreditApplication: jest.fn(),
}));

test('introduces NexCredit before opening the live workbench', async () => {
  login.mockResolvedValue({ token: 'test-token', username: 'underwriter', roles: ['UNDERWRITER'] });
  getCreditApplications.mockReturnValue(Promise.resolve({ json: () => Promise.resolve([]) }));
  getAuditLogs.mockReturnValue(Promise.resolve({ json: () => Promise.resolve([]) }));
  render(<App />);
  expect((await screen.findAllByText(/NexCredit AI/i)).length).toBeGreaterThan(0);
  expect(await screen.findByRole('heading', { name: /Credit decisions with context/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Responsible by design/i })).toBeInTheDocument();
  expect(screen.queryByText(/Priya Sharma/i)).not.toBeInTheDocument();
  expect(await screen.findByText(/Open live workbench/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Open live workbench/i));
  expect(await screen.findByRole('heading', { name: /Command Center/i })).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: /Workbench navigation/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Start application/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Underwriting Studio/i }));
  expect(await screen.findByRole('heading', { name: /Underwriting Studio/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Evidence Intelligence/i }));
  expect(await screen.findByRole('heading', { name: /Evidence Intelligence/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Review & Governance/i }));
  expect(await screen.findByRole('heading', { name: /Review & Governance/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Platform Architecture/i }));
  expect(await screen.findByRole('heading', { name: /Platform Architecture/i })).toBeInTheDocument();
});

test('opens the application drawer from the Command Center', async () => {
  login.mockResolvedValue({ token: 'test-token', username: 'underwriter', roles: ['UNDERWRITER'] });
  getCreditApplications.mockReturnValue(Promise.resolve({ json: () => Promise.resolve([]) }));
  getAuditLogs.mockReturnValue(Promise.resolve({ json: () => Promise.resolve([]) }));
  render(<App />);
  fireEvent.click(await screen.findByText(/Open live workbench/i));
  fireEvent.click(screen.getByRole('button', { name: /Start application/i }));
  expect(await screen.findByRole('heading', { name: /Credit application/i })).toBeInTheDocument();
});
