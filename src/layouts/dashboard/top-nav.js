import PropTypes from 'prop-types';
import BellIcon from '@heroicons/react/24/solid/BellIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../Auth/AuthProvider';
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Stack,
  SvgIcon,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { alpha } from '@mui/material/styles';
// import { usePopover } from 'src/hooks/use-popover';
// import { AccountPopover } from './account-popover';

const SIDE_NAV_WIDTH = 300;
const TOP_NAV_HEIGHT = 44;

export const TopNav = () => {
  const {logout} = useAuth()
  // const { onNavOpen } = props;
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const accountPopover = usePopover();

  return (
    <>
      <Box
        component="header"
        sx={{
          // backdropFilter: 'blur(6px)',
          // backgroundColor:'#f5f5f5'
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: 50,
            mt:-7,
            p:4
           
          }}
        >
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            // p={4}
          >
            {/* {!lgUp && (
              <IconButton 
              // onClick={onNavOpen}
              >
                <SvgIcon fontSize="small">
                  <Bars3Icon />
                </SvgIcon>
              </IconButton>
            )} */}
            {/* <Tooltip title="Search">
              <IconButton>
                <SvgIcon fontSize="small">
                  <MagnifyingGlassIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip> */}
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Tooltip title="Contacts">
              <IconButton>
                <SvgIcon fontSize="small">
                  <UsersIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton>
                <Badge
                  badgeContent={4}
                  color="success"
                  variant="dot"
                >
                  <SvgIcon fontSize="small">
                    <NotificationsIcon />
                  </SvgIcon>
                </Badge>
              </IconButton>
            </Tooltip>
            {/* <Avatar
              // onClick={accountPopover.handleOpen}
              // ref={accountPopover.anchorRef}
              // sx={{
              //   cursor: 'pointer',
              //   height: 40,
              //   width: 40
              // }}
              src="/assets/avatars/avatar-anika-visser.png"
            /> */}
             <Tooltip title="Logout">
  <IconButton onClick={logout}>
    <SvgIcon fontSize="small">
      <PowerSettingsNewIcon />
    </SvgIcon>
  </IconButton>
</Tooltip>

          </Stack>
        </Stack>
      </Box>
      {/* <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      /> */}
    </>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func
};
