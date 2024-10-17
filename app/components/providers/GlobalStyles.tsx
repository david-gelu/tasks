"use client";
import React from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
}

function GlobalStyleProvider({ children }: Props) {
  return <GlobalStyles>{children}</GlobalStyles>;
}

const GlobalStyles = styled.div`
  padding: 2.5em;
  display: flex;
  gap: 2.5em;
  height: 100%;
  transition: all 0.3s ease-in-out;

  @media screen and (max-width: 768px) {
    padding: 1em;
    gap: 1em;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(70dvw,15em), 1fr));
    gap: 1.5em;
  }

  ::-webkit-scrollbar {
    width: 0.35em;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--text-color);
    border-radius: .5em;
    box-shadow: inset 0 0 3px var(--text-color);
}

::-webkit-scrollbar-track {
    border-radius: .5em;
    box-shadow: inset 0 0 6px var(--text-color);
}
`;

export default GlobalStyleProvider;
