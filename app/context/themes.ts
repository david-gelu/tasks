export interface Theme {
  name: string
  colorBg: string
  colorBg2: string
  colorSuccess: string
  colorWarning: string
  colorDanger: string
  colorGradient: string
  colorGreenDark: string
  colorGreenLight: string
  activeNavLink: string
  activeNavLinkHover: string
  colorPrimary: string
  colorGreyDark: string
  color1: string
  color2: string
  btnColor1: string
  colorGrey2: string
  colorGrey3: string
  colorGrey5: string
  colorWhite: string
  colorPrimaryGreen?: string
  borderColor: string
  borderColor2: string
  shadow7: string
  sidebarWidth: string
  colorIcons: string
  colorIcons2: string
  borderRadiusMd?: string
  borderRadiusMd2?: string
}

const themes: Theme[] = [
  {
    name: "dark",
    colorBg: "var(--bg-color)",
    colorBg2: "var(--bg-color-accent)",
    colorSuccess: "var(--success)",
    colorWarning: "var(--warning)",
    colorDanger: "var(--danger)",
    colorGradient: "linear-gradient(110.42deg, #CF57A3 29.2%, #4731B6 63.56%)",
    colorGreenDark: "var(--link-color-accent)",
    colorGreenLight: "var(--link-color)",
    activeNavLink: "var(--bg-color)",
    activeNavLinkHover: "rgba(249,249,249, 0.03)",
    colorPrimary: "#7263F3",
    colorGreyDark: "#131313",
    color1: "var(--text-color)",
    color2: "#dbe1e8",
    btnColor1: "var(--second-color)",
    colorGrey2: "#b2becd",
    colorGrey3: "#6c7983",
    colorGrey5: "#2a2e35",
    colorWhite: "#fff",
    colorPrimaryGreen: "#6FCF97",
    borderColor: "var(--second-color)",
    borderColor2: "var(--primary-color)",
    shadow7: "1px 2px 5px var(--text-color)",
    sidebarWidth: "15rem",
    colorIcons: "var(--nav-color)",
    colorIcons2: "var(--link-color)",
  },
  {
    name: "light",
    colorBg: "var(--bg-color)",
    colorBg2: "var(--bg-color-accent)",
    colorSuccess: "var(--success)",
    colorWarning: "var(--warning)",
    colorDanger: "var(--danger)",
    colorGradient: "linear-gradient(110.42deg, #CF57A3 29.2%, #4731B6 63.56%)",
    colorGreenDark: "var(--link-color-accent)",
    colorGreenLight: "var(--link-color)",
    activeNavLink: "var(--bg-color)",
    activeNavLinkHover: "#C5C5C5",
    colorPrimary: "#7263F3",
    colorGreyDark: "#131313",
    color1: "var(--text-color)",
    color2: "#dbe1e8",
    btnColor1: "var(--second-color)",
    colorGrey2: "#b2becd",
    colorGrey3: "#6c7983",
    colorGrey5: "#2a2e35",
    colorWhite: "#fff",
    borderRadiusMd: "12px",
    borderRadiusMd2: "15px",
    borderColor: "var(--second-color)",
    borderColor2: "var(--primary-color)",
    shadow7: "1px 2px 5px var(--text-color)",
    sidebarWidth: "15rem",
    colorIcons: "var(--nav-color)",
    colorIcons2: "var(--link-color)",
  },
];

export default themes;