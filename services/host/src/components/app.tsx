import { adminRoutes } from '@packages/shared/src/routes/admin'
import { shopRoutes } from '@packages/shared/src/routes/shop'
import { Link, Outlet } from 'react-router-dom'

export const App = () => {
	return (
		<div data-testid='App.DataTestId'>
			<h1>HOST MODULE</h1>
			<Link to={adminRoutes.about}>About</Link>
			<br />
			<Link to={shopRoutes.main}>Shop</Link>
			<Outlet />
		</div>
	)
}
