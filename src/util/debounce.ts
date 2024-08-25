export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number = 500
) => {
    let timer: NodeJS.Timeout | number;

    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}