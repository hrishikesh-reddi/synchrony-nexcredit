import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { getAuditLogs, getCreditApplications } from './Client';

jest.mock('./Client', () => ({
  getAllStudents: jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) })),
  getCreditApplications: jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) })),
  getAuditLogs: jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) })),
  analyzeCreditApplication: jest.fn(),
  createCreditApplication: jest.fn(),
}));

test('introduces NexCredit before opening the live workbench', async () => {
  getCreditApplications.mockReturnValue(Promise.resolve({ json: () => Promise.resolve([]) }));
  getAuditLogs.mockReturnValue(Promise.resolve({ json: () => Promise.resolve([]) }));
  render(<App />);
  expect((await screen.findAllByText(/NexCredit AI/i)).length).toBeGreaterThan(0);
  expect(await screen.findByRole('heading', { name: /Credit decisions with context/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Architecture you can explain/i })).toBeInTheDocument();
  expect(screen.queryByText(/Priya Sharma/i)).not.toBeInTheDocument();
  expect(await screen.findByText(/Open live workbench/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Open live workbench/i));
  expect(await screen.findByText(/Good morning, analyst/i)).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: /Workbench navigation/i })).toBeInTheDocument();
  expect(screen.getByText('Applications', { selector: 'span' })).toBeInTheDocument();
  expect(screen.getByText(/API live/i)).toBeInTheDocument();
});
