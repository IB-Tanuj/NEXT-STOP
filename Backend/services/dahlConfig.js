export const DEFAULT_DAHL_MODEL = 'MiniMaxAI/MiniMax-M2.7';
export const DEFAULT_DAHL_URL = 'https://inference.dahl.global/v1/chat/completions';

export const getDahlApiKey = () => process.env.DAHL_API_KEY?.trim() || '';

export const getDahlApiUrl = () => process.env.DAHL_API_URL?.trim() || DEFAULT_DAHL_URL;

export const getDahlModel = () => process.env.DAHL_MODEL?.trim() || DEFAULT_DAHL_MODEL;

export const isDahlConfigured = () => Boolean(getDahlApiKey());
