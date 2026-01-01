## Packages
@make-software/csprclick-ui | Casper Wallet integration UI
@make-software/csprclick-core-client | Core client for Casper wallet
styled-components | Required dependency for csprclick-ui
axios | HTTP client (requested in prompt, though fetch is fine, will include for compliance)
framer-motion | Smooth animations for dashboard interactions

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
}
