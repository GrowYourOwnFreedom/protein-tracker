 function formatNumber(number:number):string {
        const roundedNumber = Math.round(number * 10) / 10;
        if (Number.isInteger(roundedNumber)) {
            return String(roundedNumber);
        }
        return roundedNumber.toFixed(1);
    }
    export {formatNumber}