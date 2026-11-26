const TAX_RATE = 0.16;
const CURRENCY_CODE = 'KES';

/**
 * Validates that an item has a non-empty name, positive price, and valid quantity.
 */
function isValidCartItem(item) {
    return (
        item !== null &&
        typeof item === 'object' &&
        typeof item.name === 'string' &&
        item.name.trim() !== '' &&
        typeof item.price === 'number' &&
        item.price >= 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );
}

/**
 * Formats a numeric amount into a readable currency string.
 */
function formatCurrency(amount) {
    return `${CURRENCY_CODE} ${amount.toFixed(2)}`;
}

/**
 * Calculates subtotal, tax, and total for a list of cart items.
 * Throws a TypeError if items is not an array or contains invalid entries.
 */
export function calculateOrderSummary(items) {
    if (!Array.isArray(items)) {
        throw new TypeError('Expected items to be an array');
    }

    const subtotal = items.reduce((sum, item) => {
        if (!isValidCartItem(item)) {
            throw new Error(`Invalid cart item: ${JSON.stringify(item)}`);
        }
        return sum + item.price * item.quantity;
    }, 0);

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    return {
        subtotal: formatCurrency(subtotal),
        tax: formatCurrency(tax),
        total: formatCurrency(total),
    };
}