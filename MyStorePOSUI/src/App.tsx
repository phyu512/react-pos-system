// App.tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './routers'; // Import the router you already built

function App() {
  // Simply provide the router configuration to the provider
  return <RouterProvider router={router} />;
}

export default App;