 function formatNumber(number) {
        const roundedNumber = Math.round(number * 10) / 10;
        if (Number.isInteger(roundedNumber)) {
            return roundedNumber;
        }
        return roundedNumber.toFixed(1);
    }
    export {formatNumber}