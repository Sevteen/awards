import { Provider, ProviderProps } from 'react-redux';

/**
 * Higher Order Component (HOC) to provide Redux store using <Provider>
 *
 * @param Component - The component to be wrapped in a <Provider>
 * @param store - Properties for <Provider> which contains Redux store
 * @returns Component wrapped in <Provider>
 *
 * @remarks
 * This HOC is useful for managing the Redux store in your application. It wraps
 * your components with the Redux <Provider> so that the store is available to them.
 * This approach can be particularly beneficial for larger and more complex applications,
 * where multiple parts of the app might need different Redux stores.
 *
 * However, for smaller or less complex applications, using this HOC might not be necessary
 * and a simpler setup with a single store could suffice.
 */
export function componentStore(Component: React.ReactNode, store: ProviderProps) {
  return <Provider {...store}>{Component}</Provider>;
}
