import advisorMenus from './advisor'
import adminMenus from './admin'
import { store } from 'store'

const role = store.getState().auth.userData.role;
// ==============================|| MENU ITEMS ||============================== //

const menuItems = role === 'admin' ? adminMenus: advisorMenus;

export default menuItems;
