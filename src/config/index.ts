// icons
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import WebOutlinedIcon from '@mui/icons-material/WebOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import FunctionsOutlinedIcon from '@mui/icons-material/FunctionsOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';

// components
import MyViolation from '../pages/MyViolation'
import ManageAllRules from '../pages/Admin/ManageAllRules'
import TSearch from '../pages/Admin/ViolationsQuery/Search'
import TTotalVioPerRepo from '../pages/Admin/ViolationsQuery/TotalVioPerRepo'
import TTop10Rules from '../pages/Admin/ViolationsQuery/Top10Rules'

// interface
import RouteItem from '../model/RouteItem.model'

// define app routes
export const routes: Array<RouteItem> = [
    {
        key: 'router-my-violation',
        title: 'My Violations',
        tooltip: 'My Violations',
        path: '/my_violations',
        enabled: true,
        component: MyViolation,
        icon: PermIdentityOutlinedIcon,
        appendDivider: false,
    },
    {
        key: 'router-admin-manage-all-rules',
        title: 'Manage All Rules',
        tooltip: 'Manage All Rules',
        path: '/admin_manage_all_rules',
        enabled: true,
        component: ManageAllRules,
        icon: WebOutlinedIcon,
    },
    {
        key: 'router-admin-violations-query',
        title: 'Violations Query',
        tooltip: 'Violations Query',
        enabled: true,
        icon: ManageSearchOutlinedIcon,
        subRoutes: [
            {
                key: 'router-vq-search',
                title: 'Search',
                tooltip: 'Search',
                path: '/vq/search',
                enabled: true,
                component: TSearch,
                icon: SearchOutlinedIcon,
            },
            {
                key: 'router-vq-total-vio-per-repo',
                title: 'Total Violations Per Repo',
                tooltip: 'Total Violations Per Repo',
                path: '/vq/total-vio-per-repo',
                enabled: true,
                component: TTotalVioPerRepo,
                icon: FunctionsOutlinedIcon,
            },
            {
                key: 'router-vq-top-10-rules',
                title: 'Top 10 Rules Being Violated',
                tooltip: 'Top 10 Rules Being Violated',
                path: '/vq/top-10',
                enabled: true,
                component: TTop10Rules,
                icon: SortOutlinedIcon,
            },
        ],
    },
]
