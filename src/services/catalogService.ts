import { api } from './api';
import type { CatalogNode } from '../types';

export const catalogService = {
  getCatalog: () => api.get<CatalogNode>('/catalog'),
};
