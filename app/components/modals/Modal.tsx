"use client"
import { useGlobalState } from "@/app/context/global"
import React from "react"
import styled from "styled-components"

interface Props {
  content: React.ReactNode
}

function Modal({ content }: Props) {
  const { closeModal } = useGlobalState()

  const { theme } = useGlobalState()
  return (
    <ModalStyled theme={theme}>
      <div className="modal-overlay" onClick={closeModal}></div>
      <div className="modal-content">{content}</div>
    </ModalStyled>
  )
}

const ModalStyled = styled.div`
  position: fixed;
  top: 50%;
  left: 0;
  translate: 0 -50%;
  width: 100%;
  height: 70dvh;
  z-index: 100;

  display: flex;
  justify-content: center;
  align-items: center;
 
  .modal-overlay {
    position: absolute;
    top: 50%;
    left:0;
    translate: 0 -50% ;
    width: 100dvw;
    height: 100dvh;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .modal-content {
    margin: 0 1em;

    padding: 1.5em;
    position: relative;
    max-width:40em;
    width: 100%;
    z-index: 100;

    border-radius: 1em;
    background-color: ${({ theme }) => theme.colorBg};
    
    border-radius: ${({ theme }) => theme.borderRadiusMd2};
    box-shadow: 0 0 0.5em black;

    @media screen and (max-width: 450px) {
      font-size: 90%;
    }
  }
`;

export default Modal;
