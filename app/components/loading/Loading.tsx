'use client'

import { useGlobalState } from '@/app/context/global'
import React from 'react'
import styled from 'styled-components'

const Loading = () => {
  const { theme } = useGlobalState()
  return (
    <LoadingStyles theme={theme}>Loading</LoadingStyles>
  )
}
const LoadingStyles = styled.div`
position: fixed;
inset: 0;
display: flex;
align-items: center;
justify-content: center;
font-size: clamp(1.5rem, 5vw, 12rem);
font-weight: 600;
background-color: ${({ theme }) => theme.colorBg2};
color: ${({ theme }) => theme.colorSuccess};
/* z-index: 100; */
`
export default Loading