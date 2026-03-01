import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import Browse from './pages/Browse';
import Subscriptions from './pages/Subscriptions';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import { ProviderDashboard } from './components/dashboard/ProviderDashboard';
import { ProviderProfile } from './components/ProviderProfile';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminProviders from './pages/admin/Providers';
import AdminMenu from './pages/admin/Menu';
import AdminSubscriptionsPage from './pages/admin/Subscriptions';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/signup',
    Component: SignupPage,
  },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: AdminDashboard,
      },
      {
        path: 'users',
        Component: AdminUsers,
      },
      {
        path: 'providers',
        Component: AdminProviders,
      },
      {
        path: 'menu',
        Component: AdminMenu,
      },
      {
        path: 'subscriptions',
        Component: AdminSubscriptionsPage,
      },
    ],
  },
  // Customer Routes
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: 'dashboard',
        Component: Dashboard,
      },
      {
        path: 'browse',
        Component: Browse,
      },
      {
        path: 'subscriptions',
        Component: Subscriptions,
      },
      {
        path: 'profile',
        Component: Profile,
      },
    ]
  },
  {
    path: '/provider/dashboard',
    element: <ProviderDashboard onLogout={() => window.location.href = '/'} />,
    loader: () => {
      // In real app, check if user is provider
      return null;
    }
  },
  {
    path: '/provider/:id',
    element: <ProviderProfile onBack={() => window.history.back()} />
  }
]);
