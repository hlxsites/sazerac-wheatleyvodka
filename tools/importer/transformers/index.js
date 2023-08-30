import removeHeaderAndFooter from './removeHeaderAndFooter.js';
import cocktails from './cocktails.js';
import links from './links.js';

export const transformers = [removeHeaderAndFooter, cocktails];
export const asyncTransformers = [];
export const preTransformers = [];
export const postTransformers = [links];
