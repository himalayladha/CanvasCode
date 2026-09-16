import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';

// Mock URL.createObjectURL and revokeObjectURL in jsdom
if (typeof window !== 'undefined') {
  window.URL.createObjectURL = (blob: Blob | MediaSource) => `blob:mock-url-${Math.random().toString(36).substring(7)}`;
  window.URL.revokeObjectURL = () => {};
}
