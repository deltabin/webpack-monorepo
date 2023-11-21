import { shopRoutes } from '@packages/shared/src/routes/shop'
import { Link } from 'react-router-dom'
const Shop = () => {
	return (
		<h1>
			SHOP
			<div>
				<Link to={shopRoutes.main}>go to main</Link>
				<Link to={shopRoutes.second}>go to second</Link>
			</div>
		</h1>
	)
}

export default Shop
