'use client'

import { signOut } from 'next-auth/react'
import { useState } from 'react'
import styled from 'styled-components'
import EditProfileModal from '../modals/EditProfileModal'
import { useClickOutside } from '@/app/hooks/useClickOutside'
import { useGlobalState } from '@/app/context/global'

interface UserDropdownProps {
  onClose: () => void
  onEditProfile: () => void
  userName: string
  userEmail?: string | null
}

const UserDropdown = ({ onClose, onEditProfile, userName, userEmail }: UserDropdownProps) => {
  const [showEditModal, setShowEditModal] = useState(false)

  const { theme } = useGlobalState()

  const dropdownRef = useClickOutside((e) => {
    const target = e.target as HTMLElement
    if (target.closest('.edit-profile-btn')) return
    onClose()
  })

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <>
      <DropdownStyled ref={dropdownRef} theme={theme}>
        <div className="dropdown-header">
          <p className="user-name">{userName}</p>
          <p className="user-email">{userEmail}</p>
        </div>
        <div className="dropdown-items">
          <button
            onClick={onEditProfile}
            className="dropdown-item"
          ><i className="fas fa-user-edit"></i> Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="dropdown-item"
          >
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </DropdownStyled>
      {showEditModal && (
        <EditProfileModal
          onClose={() => setShowEditModal(false)}
          currentName={userName}
          currentEmail={userEmail}
        />
      )}
    </>
  )
}

const DropdownStyled = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-25%);
  background-color: ${({ theme }) => theme.colorBg2};
  border: 2px solid ${({ theme }) => theme.colorGreenDark};
  border-radius: 1em;
  width: min(80vw, 20em);
  max-width: max(80vw, 20em);
  z-index: 10000;
  overflow: auto;
  margin-top: 1rem;
 @media screen and (max-width: 768px) {
  transform: translateX(-35%);
      }
  .dropdown-header {
    padding: 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.colorIcons};
    
    .user-name {
      font-weight: 600;
      color: ${({ theme }) => theme.colorIcons};
    }
    
    .user-email {
      font-size: 0.9rem;
      color: ${({ theme }) => theme.colorIcons};
    }
  }

  .dropdown-items {
    .dropdown-item {
      width: 100%;
      padding: 0.8rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: ${({ theme }) => theme.colorIcons};
      background: none;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: ${({ theme }) => theme.activeNavLinkHover};
        color: ${({ theme }) => theme.colorGreenDark};
      }

      i {
        font-size: 1.1rem;
      }
    }
  }
`

export default UserDropdown