export const SAVED_TRIP_LIMIT = 20;
export const SAVED_TRIP_LIMIT_CODE = 'SAVED_TRIP_LIMIT_EXCEEDED';

export const isSavedTripLimitError = (error) => {
    const values = [error?.code, error?.message, error?.details, error?.hint];
    return values.some(value => String(value || '').includes(SAVED_TRIP_LIMIT_CODE));
};

export const savedTripLimitResponse = () => ({
    error: SAVED_TRIP_LIMIT_CODE,
    message: `You already have ${SAVED_TRIP_LIMIT} saved trips. Delete one before saving another.`,
    limit: SAVED_TRIP_LIMIT,
});
