export default (): string => {
    const isoString = new Date().toISOString();
    const splitIsoString = isoString.split(":");
    const milliseconds = splitIsoString[2].replace("Z", "");
    const millisecondsNumber = Number(milliseconds);
    const roundedMilliseconds = Math.round(millisecondsNumber);
    return `${splitIsoString[0]}:${splitIsoString[1]}:${roundedMilliseconds}Z`;
};
