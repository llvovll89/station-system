interface Theme {
    fontSize: FontSize;
    color: Color;
    boxShadow?: BoxShadow;
}

interface FontSize {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    subTitle: string;
    mainTitle: string;
}

interface Color {
    primary: string;
    black: string;
    white: string;
    subWhite: string;
    red: string;
    subPrimary: string;
}

interface BoxShadow {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    inner: string;
    none: string;
}

const calRem = (size: number) => `${size / 16}rem`;

const theme: Theme = {
    fontSize: {
        xs: calRem(12),
        sm: calRem(14),
        md: calRem(16),
        lg: calRem(18),
        xl: calRem(20),
        subTitle: calRem(24),
        mainTitle: calRem(32),
    },

    color: {
        primary: "#09f",
        black: "#111111",
        white: "#FDFEFE",
        red: "#ff0000",
        subPrimary: "#F5F7F8",
        subWhite: "#F5F7F8"
    },

    boxShadow: {
        xs: '0 0 1px 2px rgba(0,0,0,0.1)',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        xxl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        none: '0 0 #0000'
    },
}

export default theme;