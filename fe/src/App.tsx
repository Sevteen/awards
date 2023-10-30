import Loading from '@components/atoms/loader/loading';
import { router } from '@routes/router';
import { Fragment } from 'react';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <Fragment>
      {/* <Loading isLoading={isLoading} /> */}
      <RouterProvider router={router} />
    </Fragment>
  );
}

// function App() {
//   return <RouterProvider router={router} fallbackElement={<Loading />} />;
// }

export default App;
