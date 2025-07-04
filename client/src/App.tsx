import { Outlet } from 'react-router-dom'
import { Stack, Typography } from '@mui/material'

function App() {
    return (
        <Stack>
            <Typography>Welcome to BuzHub</Typography>
            <Outlet />
        </Stack>
    )
}

export default App
