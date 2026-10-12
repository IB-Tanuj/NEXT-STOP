const WALLET_TYPES = new Set(['stay', 'transport', 'food', 'buffer']);

export const parsePositiveWalletAmount = (value) => {
    if (typeof value !== 'number' && typeof value !== 'string') return null;
    if (typeof value === 'string' && value.trim() === '') return null;

    const amount = Number(value);
    return Number.isFinite(amount) && amount > 0 ? amount : null;
};

export const isWalletType = (value) => WALLET_TYPES.has(value);

export const callWalletRpc = async (client, name, params) => {
    const { data, error } = await client.rpc(name, params);
    if (error) throw error;
    if (data === null || data === undefined) {
        throw new Error('Wallet database function returned an invalid response.');
    }
    return data;
};
