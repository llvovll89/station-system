interface Theme {
    fonsize: FontSize;
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
    red: string;
}

interface BoxShadow {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
}

const calRem = (size: number) => `${size / 16}rem`;

const theme:Theme = {
    fonsize: {
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
        red: "#ff0000"
    },

    // box_shadow: {
    //     xs: '0 0 1px 2px rgba(0,0,0,0.1)',
    // },
}

export default theme;