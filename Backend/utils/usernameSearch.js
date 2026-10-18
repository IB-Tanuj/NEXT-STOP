const ILIKE_SPECIAL_CHARACTERS = /[\\%_]/g;
const WHITESPACE = /\s/u;

export const getUsernameValidationError = (username, label = 'Username') => {
    if (typeof username !== 'string' || username.length === 0) {
        return `${label} is required`;
    }

    if (WHITESPACE.test(username)) {
        return `${label} cannot contain whitespace`;
    }

    return null;
};

export const escapeIlikePattern = (username) => username.replace(ILIKE_SPECIAL_CHARACTERS, '\\$&');
