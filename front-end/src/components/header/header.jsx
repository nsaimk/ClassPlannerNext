import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { /* specific components or styles */ } from '@material-ui/core';

const Header = () => {
  return (
    <div>
      <AppBar position="fixed" >
        <Toolbar style={{ backgroundColor: "white"}}>
          <img
            src="https://ih1.redbubble.net/image.2953589498.1437/st,small,507x507-pad,600x600,f8f8f8.jpg" 
            style={{ height: '90px', margin: '5px 0px' }}
          />
          <Typography variant="h2"
            component="div"
            sx={{
              flexGrow: 1,
              color: "black",
              justifyContent: 'flex-end',
              display: 'flex',
              fontFamily: "'Arvo', serif",
              letterSpacing: '-4px',
              fontWeight: 'bold'
            }}>
            Class Planner
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header;
