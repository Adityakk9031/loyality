import { ClickUI } from "@make-software/csprclick-ui";
import styled from "styled-components";

// Styling to override csprclick defaults to match our theme
const WalletWrapper = styled.div`
  /* Override styles here if needed, csprclick usually handles its own styling well */
  .csprclick-button {
    background: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 0.75rem !important;
    color: white !important;
    font-family: 'Outfit', sans-serif !important;
    font-weight: 500 !important;
    transition: all 0.2s ease-in-out !important;
    
    &:hover {
      background: rgba(255, 255, 255, 0.05) !important;
      border-color: rgba(255, 255, 255, 0.2) !important;
    }
  }
`;

export function WalletConnect() {
  return (
    <WalletWrapper>
      <ClickUI />
    </WalletWrapper>
  );
}
