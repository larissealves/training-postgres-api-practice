import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import {ListDish} from './components/ListDish.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ListDish />
  </StrictMode>,
)
