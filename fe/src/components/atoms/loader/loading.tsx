import React from 'react';
import styled, { keyframes } from 'styled-components';

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--white-orange);
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  justify-content: center;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #1bd97b;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 10px;
  font-size: 18px;
  color: #333;
`;

const Loading = ({ isLoading, text = 'Loading...' }) => {
  if (!isLoading) {
    return null;
  }
  return (
    <LoadingContainer>
      <LoadingWrapper>
        <LoadingSpinner />
        <LoadingText>{text}</LoadingText>
      </LoadingWrapper>
    </LoadingContainer>
  );
};

export default Loading;
