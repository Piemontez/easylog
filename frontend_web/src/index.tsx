import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoutesFromElements, RouterProvider } from 'react-router-dom';
import './assets/fontawasome.library';
import './assets/theme.scss';
import { createBaseRouter } from './commons/route';
import apiConfigure from './config/api.config';
import * as serviceWorker from './serviceWorker';
import UserCtxInstance, { UserProvider } from './store/userContext';
import routes from './views/routes';
import { Helmet } from 'react-helmet';

UserCtxInstance.loadUser();
apiConfigure(UserCtxInstance.token);

const router = createBaseRouter(createRoutesFromElements(routes));

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.Suspense fallback="loading">
    <Helmet title="EasyLog">
      <meta name="description" content="EasyLog" />
    </Helmet>
    <UserProvider value={UserCtxInstance}>
      <RouterProvider router={router} />
    </UserProvider>
  </React.Suspense>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
