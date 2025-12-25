// utils/test-emails.ts
const STORAGE_KEY = 'zemenai-test-emails';

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const getTestEmails = (): string[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading test emails:', error);
        return [];
    }
};

export const registerUserEmail = (email: string): boolean => {
    try {
        if (!email || !isValidEmail(email)) {
            console.error('Invalid email format');
            return false;
        }

        const emails = getTestEmails();

        if (emails.includes(email)) {
            console.log('Email already registered');
            return true;
        }

        emails.push(email);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
        console.log('Email registered successfully:', email);
        return true;
    } catch (error) {
        console.error('Error registering email:', error);
        return false;
    }
};

export const removeUserEmail = (email: string): boolean => {
    try {
        const emails = getTestEmails();
        const filtered = emails.filter(e => e !== email);

        if (filtered.length === emails.length) {
            console.log('Email not found');
            return false;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        console.log('Email removed successfully:', email);
        return true;
    } catch (error) {
        console.error('Error removing email:', error);
        return false;
    }
};

export const isEmailRegistered = (email: string): boolean => {
    const emails = getTestEmails();
    return emails.includes(email);
};

export const clearAllTestEmails = (): boolean => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('All test emails cleared');
        return true;
    } catch (error) {
        console.error('Error clearing test emails:', error);
        return false;
    }
};

export const DEFAULT_TEST_EMAILS = [
    'admin@zemenai.com',
    'test@zemenai.com',
    'demo@zemenai.com'
];