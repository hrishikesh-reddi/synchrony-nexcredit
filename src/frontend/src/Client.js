import fetch from 'unfetch';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

let authToken = null;
export const setAuthToken = token => { authToken = token || null; };
export const getAuthToken = () => authToken;

const checkStatus = response => {
  if (response.ok) return response;
  const error = new Error(response.statusText || 'Request failed');
  error.response = response;
  return Promise.reject(error);
};

const authHeaders = () => (authToken ? { Authorization: `Bearer ${authToken}` } : {});

const jsonRequest = (path, method, body) => fetch(`${API_BASE}${path}`, {
  method,
  headers: { 'Content-Type': 'application/json', ...authHeaders() },
  body: JSON.stringify(body),
}).then(checkStatus).then(response => response.json());

export const login = (username, password) => jsonRequest('/api/auth/login', 'POST', { username, password });

export const getHealth = () => fetch(`${API_BASE}/api/health`).then(checkStatus).then(response => response.json());

export const getCreditApplications = () => fetch(`${API_BASE}/api/credit/applications`, { headers: authHeaders() }).then(checkStatus);
export const getPendingReviewApplications = () => fetch(`${API_BASE}/api/credit/pending-review`, { headers: authHeaders() }).then(checkStatus);
export const reviewCreditApplication = (applicationId, decision, reviewerNotes) => jsonRequest(`/api/credit/review/${applicationId}`, 'POST', { decision, reviewerNotes });
export const getAuditLogs = () => fetch(`${API_BASE}/api/audit/logs`).then(checkStatus);
export const createCreditApplication = application => jsonRequest('/api/credit/applications', 'POST', application);
export const analyzeCreditApplication = application => jsonRequest('/api/credit/analyze', 'POST', application);
export const uploadCreditDocument = (applicationId, file) => {
  const body = new FormData();
  body.append('applicationId', applicationId);
  body.append('file', file);
  return fetch(`${API_BASE}/api/credit/upload`, { method: 'POST', headers: authHeaders(), body }).then(checkStatus).then(response => response.json());
};

export const searchEvidence = (query, k) => jsonRequest('/api/credit/evidence/search', 'POST', { query, k });
export const explainDecision = application => jsonRequest('/api/credit/explanation', 'POST', application);
