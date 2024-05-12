export const timeOut = (sec: number, callback: () => void): void => {
    setTimeout(() => {
        callback();
    }, sec); 
}
