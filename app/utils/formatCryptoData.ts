export const formatCryptoData = (value: number | null | undefined): string => {
    if (value === null || value === undefined || value === 0) {
        return '-';
    }

    // Rounding to 2 decimal places for larger numbers
    return value > 1 ? value.toFixed(2) : value.toPrecision(4);
};