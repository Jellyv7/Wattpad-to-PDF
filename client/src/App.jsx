import { createBrowserRouter, RouterProvider, useLocation, Outlet } from 'react-router-dom';
import './assets/index.css';
import Index from './pages/Index';
import { StoriesProvider, LogsProvider } from './context';

const AppLayout = () => {
	const location = useLocation();
	const { pathname } = location; 

	return (
		<LogsProvider>
			<StoriesProvider>
				<main className='app'>
					<Outlet key={ pathname }/>
				</main>
			</StoriesProvider>
		</LogsProvider>
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
