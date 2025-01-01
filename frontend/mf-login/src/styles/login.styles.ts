import styled from '@emotion/styled';
import { theme } from './theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 600px; 
  padding: 0 1rem;
`;

export const FormCard = styled.div`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: 3rem;
  }
`;

export const Title = styled.h1`
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
  font-family: 'Bebas Neue', sans-serif;
  font-weight: normal; /* Remove bold */
`;

export const Subtitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-family: 'Bebas Neue', sans-serif;
  font-weight: normal; /* Remove bold */
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;

  input {
    padding-right: ${(props: { hasIcon: any; }) => props.hasIcon ? '40px' : '12px'};
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${theme.colors.text};
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5;
  width: 100%;
  max-width: 200px; /* Ensure all labels have the same width */
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  &[type="checkbox"] {
    width: auto;
    margin-right: 8px;
  }
`;

export const PasswordWrapper = styled(InputWrapper)`
  input {
    padding-right: 40px;
  }
  width: 100%; /* Ensure the wrapper takes the full width */
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

export const PasswordStrengthBar = styled.div<{ strength: 'weak' | 'medium' | 'strong' }>`
  height: 4px;
  width: 100%;
  margin-top: 0.5rem;
  background-color: ${props => {
    switch (props.strength) {
      case 'weak':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'strong':
        return theme.colors.success;
      default:
        return '#ddd';
    }
  }};
  transition: background-color 0.3s;
`;

export const ErrorText = styled.p`
  color: ${theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.25rem;
  width: 100%;
`;

export const Button = styled.button<{ variant?: 'primary' | 'google' }>`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  font-family: 'Bebas Neue', sans-serif; /* Set font family */
  cursor: pointer;
  transition: opacity 0.2s;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  background-color: ${props => 
    props.variant === 'google' ? theme.colors.white : '#EA7600'};
  color: ${props => 
    props.variant === 'google' ? theme.colors.text : theme.colors.white};
  border: ${props => 
    props.variant === 'google' ? `1px solid #ddd` : 'none'};
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const LinkText = styled.p`
  text-align: center;
  color: ${theme.colors.text};
  margin-top: 1rem;
  width: 100%;
  
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Modal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
`;

export const ModalContent = styled.div`
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
  text-align: center;
`;

export const CloseButton = styled.span`
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  &:hover,
  &:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;
