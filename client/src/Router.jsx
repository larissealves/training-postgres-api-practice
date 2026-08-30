import { Route, Routes, Navigate } from "react-router-dom";

import ListDish from './components/ListDish.jsx'
import ListDishScreenFilters from './components/ListDishScreenFilters.jsx'

function Router() {
    return(
        <Routes>
            <Route path="/" element={<ListDish/>} />
            <Route path='/screenFilters' element={<ListDishScreenFilters/>}/>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default Router;