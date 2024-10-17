"use client";

import { useGlobalState } from "@/app/context/global";
import React from "react";
import styled from "styled-components";

interface Props {
  icon?: React.ReactNode;
  name?: string;
  background?: string;
  padding?: string;
  borderRad?: string;
  fw?: string;
  fs?: string;
  click?: () => void;
  type?: "submit" | "button" | "reset" | undefined;
  border?: string;
  color?: string;
}

function Button({
  icon,
  name,
  background,
  padding,
  borderRad,
  fw,
  fs,
  click,
  type,
  border,
  color,
}: Props) {
  const { theme } = useGlobalState();

  return (
    <ButtonStyled
      type={type}
      style={{
        background: background,
        padding: padding || "0.25em 0.5em",
        borderRadius: borderRad || "0.5em",
        fontWeight: fw || "700",
        fontSize: fs,
        border: border || "none",
        color: color || theme.btnColor1,
      }}
      theme={theme}
      onClick={click}
    >
      {icon && icon}
      {name}
    </ButtonStyled>
  );
}

const ButtonStyled = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.btnColor1};
  z-index: 5;
  cursor: pointer;

  transition: all 0.55s ease-in-out;

  i {
    margin-right: 0.5em;
    font-size: 1.5rem;
    transition: color 0.55s ease-in-out;
  }

  &:hover {
      background: ${({ theme }) => theme.colorPrimaryGreen} !important;
      color: ${({ theme }) => theme.colorWhite} !important;
  }
`;

export default Button;
