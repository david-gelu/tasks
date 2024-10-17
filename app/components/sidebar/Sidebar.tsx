"use client"
import React from "react"
import styled from "styled-components"
import Image from "next/image"

import menu from "@/app/utils/menu"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { arrowLeft, bars, logout, moon, sun } from "@/app/utils/Icons"
import { SignInButton, SignedOut, UserButton, useClerk, useUser } from "@clerk/nextjs"
import { useGlobalState } from "@/app/context/global"
import Button from "../button/Button"
import Loading from "../loading/Loading"

function Sidebar() {
  const { theme, changeThemeColor, collapsed, collapseMenu } = useGlobalState()
  const { signOut } = useClerk()

  const { user, isSignedIn, isLoaded } = useUser()

  const { firstName, lastName, imageUrl } = user || {
    firstName: "",
    lastName: "",
    imageUrl: "",
  }

  const router = useRouter()
  const pathname = usePathname()

  const handleClick = (link: string) => {
    router.push(link)
  }
  if (!isSignedIn) return <></>

  if (!isLoaded) return <Loading />

  return (
    <SidebarStyled className="fancy-border" theme={theme} $collapsed={collapsed}>
      <button className="toggle-nav" onClick={collapseMenu}>
        {collapsed ? bars : arrowLeft}
      </button>
      <div className="profile">
        <div className="profile-overlay"></div>
        <div className="image">
          {imageUrl ? <div className="user-btn absolute z-20 top-0 w-full h-full">
            <UserButton />
          </div>
            : <Image width={70} height={70} src={'/user-logo.png'} alt="profile" />}
        </div>
        <h1 className="capitalize">
          {firstName} {lastName}
        </h1>
      </div>
      <ul className="nav-items">
        <li
          className={`nav-item`} style={{ color: theme.color1, zIndex: 2 }}
          onClick={() => theme.name === 'light' ? changeThemeColor('dark') : changeThemeColor('light')}>
          {theme.name === 'light' ? sun : moon}<a>Theme</a>
        </li>
        {menu.map((item) => {
          const link = item.link
          return (
            <li
              key={item.id}
              className={`nav-item ${pathname === link ? "active" : ""}`}
              onClick={() => handleClick(link)} >
              {item.icon}
              <Link href={link}>{item.title}</Link>
            </li>
          )
        })}
      </ul>
    </SidebarStyled>
  )
}

const SidebarStyled = styled.nav<{ $collapsed: boolean }>`
  position: relative;
  width: ${({ theme }) => theme.sidebarWidth};
  background-color: ${({ theme }) => theme.colorBg2};
  /* border: 2px solid ${({ theme }) => theme.borderColor2}; */
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${({ theme }) => theme.colorGrey3};
  height: calc(100dvh - 5em); 
  z-index: 100;
    @media screen and (max-width: 768px) {
    position: fixed;
    height: calc(100vh - 2em);
    z-index: 100;
    transition: all 0.3s cubic-bezier(0.53, 0.21, 0, 1);
    transform: ${({ $collapsed }) => $collapsed ? "translateX(-107%)" : "translateX(0)"};
    .toggle-nav {
      display: block !important;
    }
  }

  .toggle-nav {
    display: none;
    padding: 0.8em 0.9em;
    position: absolute;
    right: -72px;
    top: 1.8em;
    border-top-right-radius: 10em;
    border-bottom-right-radius: 10em;
    color: var(--text-color);
    background-color: ${({ theme }) => theme.colorBg2};
    border: 0.1em solid;
    border-image-slice: 1;
    border-image-source:${({ theme }) => `linear-gradient(0deg, transparent 15%, ${theme.color1}, transparent 85%)`} ;
  }

  .user-btn {
    .cl-userButtonAvatarBox{
      width: 100%;
      height: 100%;
    }
    .cl-rootBox {
      width: 100%;
      height: 100%;

      .cl-userButtonBox {
        width: 100%;
        height: 100%;

        .cl-userButtonTrigger {
          width: 100%;
          height: 100%;
          opacity: 0;
        }
      }
    }
  }

  .profile {
    margin: 1.5em 1.5em 0;
    padding: 1em 0.8em;
    position: relative;
    border-radius: 1em;
    /* cursor: pointer; */
    font-weight: 500;
    color: ${({ theme }) => theme.colorGreenDark};
    display: flex;
    align-items: center;
    flex-direction:column;
    gap: 0.5em;
    .profile-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(10px);
      z-index: 0;
      background: ${({ theme }) => theme.colorBg3};
      transition: all 0.55s linear;
      border-radius: 1em;
      border: 2px solid ${({ theme }) => theme.borderColor2};
      opacity: 0.2;
    }

    h1 {
      font-size: 1.2rem;
      display: flex;
      flex-direction: column;

      line-height: 1.4em;
    }

    .image,
    h1 {
      position: relative;
      z-index: 1;
    }

    .image {
      flex-shrink: 0;
      display: inline-block;
      overflow: hidden;
      transition: all 0.5s ease;
      border-radius: 100%;

      width: 70px;
      height: 70px;

      img {
        border-radius: 100%;
        transition: all 0.5s ease;
      }
    }

    > h1 {
      text-align: center;
      font-size: clamp(1.2rem, 4vw, 1.4rem);
      line-height: 100%;
    }

    &:hover {
      .profile-overlay {
        opacity: 1;
        border: 2px solid ${({ theme }) => theme.colorGreenDark};
      }

      img {
        transform: scale(1.1);
      }
    }
  }
  .nav-items{
    margin-block: auto;
  }
  .nav-item {
    position: relative;
    padding: 0.8rem 1rem 0.9rem 2.1rem;
    margin: 0.3rem 0;

    display: grid;
    grid-template-columns: 40px 1fr;
    cursor: pointer;
    align-items: center;
    color: ${({ theme }) => theme.colorIcons};

    &::after {
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      width: 0;
      height: 100%;
      background-color: ${({ theme }) => theme.activeNavLinkHover};
      z-index: 1;
      transition: all 0.3s ease-in-out;
    }

    &::before {
      position: absolute;
      content: "";
      right: 0;
      top: 0;
      width: 0%;
      height: 100%;
      background-color: ${({ theme }) => theme.colorGreenDark};
      border-bottom-left-radius: 5px;
      border-top-left-radius: 5px;
    }

    a {
      font-weight: 500;
      transition: all 0.3s ease-in-out;
      z-index: 2;
      line-height: 0;
    }

    i {
      display: flex;
      align-items: center;
      
    }

    &:hover {
      &::after {
        width: 100%;
      }
    }
  }

  .active {
    background-color: ${({ theme }) => theme.activeNavLink};
    :is(i, a) {
      color: ${({ theme }) => theme.colorGreenDark};
      font-weight: 700;
    }
  }

  .active::before {
    width: 0.3em;
    margin-right: 0.1em;
  }

  > button {
    margin: 1.5em;
  }
`;

export default Sidebar;
