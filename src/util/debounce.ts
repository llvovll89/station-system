export const debounce = <T extends (...args: any[]) => void>(func: T, delay = 500) => {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};