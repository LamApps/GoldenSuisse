// project imports
import NavItem from './NavItem';
import adminItem from 'menu-items/admin';
import advisorItem from 'menu-items/advisor';
import { Divider, Box } from '@mui/material';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = ({userData}) => {
    const menuItem = userData?.role === 'admin' ? adminItem : advisorItem;
    const navItems = menuItem.map((item, index) => {
        return index<menuItem.length-1 ? <Box key={item.id}><NavItem item={item} /><Divider sx={{opacity: 0.2}}></Divider></Box> : <NavItem key={item.id} item={item} />;
    });

    return <>{navItems}</>;
};

export default MenuList;
