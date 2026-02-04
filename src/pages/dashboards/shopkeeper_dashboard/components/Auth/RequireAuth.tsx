import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ShopkeeperPortal from '../../pages/ShopkeeperPortal';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  // If user is authenticated but hasn't completed shop registration (no shopId)
  if (!user?.shopId || user.shopId === 'unknown') {
    return <ShopkeeperPortal />;
  }

  return children;
};

export default RequireAuth; 