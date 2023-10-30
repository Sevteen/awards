import { createGlobalStyle } from 'styled-components';
import '../index.css';

const GlobalStyles = createGlobalStyle`
  .text {
    &-orange {
      color: var(--orange);
    }

    &-secondary {
      color: var(--secondary);
    }

    &-white-orange {
      color: var(--white-orange);
    }

    &-gray {
      color: var(--gray);
    }

    &-weight-400 {
        font-weight: 400;
    }

    &-weight-500 {
        font-weight: 500;
    }

    &-weight-600 {
        font-weight: 600;
    }

    &-weight-700 {
        font-weight: 700;
    }
  }

  .opacity {
    &-small {
        opacity: 0.8
    }

    &-medium {
        opacity: 0.6
    }

    &-large {
        opacity: 0.4
    }

    &-xl {
        opacity: 0.2
    }
  }
`;

export default GlobalStyles;
