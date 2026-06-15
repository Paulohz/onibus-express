import { createBrowserRouter } from 'react-router-dom'
import SearchPage from '@/pages/SearchPage'
import SeatMapPage from '@/pages/SeatMapPage'
import PassengerFormPage from '@/pages/PassengerFormPage'
import ConfirmationPage from '@/pages/ConfirmationPage'

export const router = createBrowserRouter([
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
])
