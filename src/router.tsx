import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import BookingSearchPage from '@/pages/BookingSearchPage'
import ConfirmationPage from '@/pages/ConfirmationPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PassengerFormPage from '@/pages/PassengerFormPage'
import SearchPage from '@/pages/SearchPage'
import SeatMapPage from '@/pages/SeatMapPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SearchPage />,
      },
      {
        path: '/viagens/:id/assentos',
        element: <SeatMapPage />,
      },
      {
        path: '/reservas/nova',
        element: <PassengerFormPage />,
      },
      {
        path: '/reservas/confirmacao',
        element: <ConfirmationPage />,
      },
      {
        path: '/reservas/consulta',
        element: <BookingSearchPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
