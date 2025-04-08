'use client'

import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useGlobalState } from '@/app/context/global'
import { useSession } from 'next-auth/react'

interface EditProfileModalProps {
  onClose: () => void
  currentName?: string | null
  currentEmail?: string | null
}

const EditProfileModal = ({ onClose, currentName, currentEmail }: EditProfileModalProps) => {
  const { data: session, update } = useSession()
  const [formData, setFormData] = useState({
    name: currentName || '',
    email: currentEmail || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const modalRef = useRef<HTMLDivElement>(null)

  const { theme } = useGlobalState()
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match")
      return
    }

    try {
      const response = await axios.put('/api/user/profile', {
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })

      if (response.data.success) {
        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            email: formData.email
          }
        })

        toast.success('Profile updated successfully')
        onClose()
        window.location.reload()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error updating profile')
    }
  }

  return (
    <ModalStyled theme={theme} ref={modalRef}>
      <div className="modal-content">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-control">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
            />
          </div>
          <div className="input-control">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
            />
          </div>
          <div className="input-control">
            <label>Current Password</label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              placeholder="Enter current password"
            />
          </div>
          <div className="input-control">
            <label>New Password</label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              placeholder="Enter new password"
            />
          </div>
          <div className="input-control">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
            />
          </div>
          <div className="button-group">
            <button type="submit" className="save-btn">Save Changes</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </ModalStyled>
  )
}

const ModalStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .modal-content {
    background: ${props => props.theme.colorBg2};
    padding: 2rem;
    border-radius: 1rem;
    width: 90%;
    max-width: 500px;

    h2 {
      color: ${props => props.theme.colorGreenDark};
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }

    .input-control {
      margin-bottom: 1rem;

      label {
      display: inline-block;
      font-size: clamp(0.9rem, 5vw, 1.2rem);

      span {
        color: ${({ theme }) => theme.color1};
      }
    }

      :is(input, textarea) {
      width: 100%;
      padding: 0.5em;

      resize: none;
      background-color: ${({ theme }) => theme.colorBg2};
      color: ${({ theme }) => theme.color1};
      border-radius: 0.5em;
      border: 2px solid ${({ theme }) => theme.colorIcons};
      transition: border-color 0.3s ease;;
      &::placeholder {
        color: lighten(#242424, 50%);
      }

      &:not(:placeholder-shown):user-valid {
        border-color: ${({ theme }) => theme.colorSuccess};
      }

      &:not(:placeholder-shown):user-invalid {
        border-color: ${({ theme }) => theme.colorDanger};
        color:  ${({ theme }) => theme.colorDanger} !important ;
      }

      &:focus:invalid {
        border-color: ${({ theme }) => theme.colorWarning};
      }
    }
    }

    .button-group {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;

      button {
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;

        &.save-btn {
          background: ${props => props.theme.colorGreenDark};
          color: white;

          &:hover {
            background: ${props => props.theme.colorGreenDark}dd;
          }
        }

        &.cancel-btn {
          background: ${props => props.theme.colorGrey3};
          color: white;

          &:hover {
            background: ${props => props.theme.colorGrey3}dd;
          }
        }
      }
    }
  }
`

export default EditProfileModal