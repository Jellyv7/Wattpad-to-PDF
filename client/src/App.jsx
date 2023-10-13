import { createBrowserRouter, RouterProvider, useLocation, Outlet } from 'react-router-dom';
import './assets/index.css';
import Index from './pages/Index';
import { StoriesProvider, AppProvider } from './context';

const AppLayout = () => {
	const location = useLocation();
	const { pathname } = location; 

	return (
		<AppProvider>
			<StoriesProvider>
					<main className='app'>
						<Outlet key={ pathname }/>
					</main>
			</StoriesProvider>
		</AppProvider>
	);
};

const router = createBrowserRouter([
	{
		element: (<AppLayout/>),
		children: [
			{
				path: '/',
				element: <Index/>
			}
		]
	}
]);


function App() {
	return <RouterProvider router={router}/>;
};

export default App;
