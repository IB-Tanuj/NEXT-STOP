const findJsonValue = (text) => {
    for (let start = 0; start < text.length; start += 1) {
        if (text[start] !== '{' && text[start] !== '[') continue;

        const opening = text[start];
        const closing = opening === '{' ? '}' : ']';
        let depth = 0;
        let inString = false;
        let escaped = false;

        for (let end = start; end < text.length; end += 1) {
            const character = text[end];

            if (inString) {
                if (escaped) escaped = false;
                else if (character === '\\') escaped = true;
                else if (character === '"') inString = false;
                continue;
            }

            if (character === '"') {
                inString = true;
            } else if (character === opening) {
                depth += 1;
            } else if (character === closing) {
                depth -= 1;
                if (depth === 0) {
                    try {
                        return JSON.parse(text.slice(start, end + 1));
                    } catch {
                        break;
                    }
                }
            }
        }
    }

    return null;
};

export const parseGeminiJson = (responseText) => {
    if (typeof responseText !== 'string' || !responseText.trim()) {
        throw new Error('Gemini returned an empty response.');
    }

    const text = responseText
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

    try {
        return JSON.parse(text);
    } catch {
        const parsed = findJsonValue(text);
        if (parsed !== null) return parsed;
        throw new Error('Gemini returned invalid JSON.');
    }
};
