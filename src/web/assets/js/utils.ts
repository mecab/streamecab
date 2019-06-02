export function timeFormatter (v: number): string {
    const hoursAndColon = v >= 3600 ? `${Math.floor(v / 3600)}:` : '';
    const minutes = `${Math.floor(v / 60) % 60}`;
    const seconds = `${v % 60}`;

    const minutesPadded = minutes.length === 1 ? `0${minutes}` : minutes;
    const secondsPadded = seconds.length === 1 ? `0${seconds}` : seconds;
    return `${hoursAndColon}${minutesPadded}:${secondsPadded}`;
};
