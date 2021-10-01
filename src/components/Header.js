import React from 'react';
import {AppBar, Button, Grid, IconButton, Toolbar} from "@mui/material";

function changeRoom(hub2) {
  console.log('inner')
  return function () {
    console.log('outer')
    const hub = window.localStorage.getItem('hub')
    const hub1 = hub ? hub : 'Copenhagen' 
    const hubs = [hub1, hub2].map(item => item.replace(/ /g,''));
    hubs.sort();
    window.location.href='/#' + hubs.join('_');
    window.location.reload();  
  }
}

function Header() {
  return (
    <AppBar position="fixed" className="app-header">
      
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          disableRipple
        >
          <div className="ui small image" />
        </IconButton>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} style={{maxWidth: "50%"}}>
          <Grid item xs={2} sm={4} md={4}>
            <Grid>
              <Button onClick={changeRoom("Copenhagen")}>
                <div className="images"/>
                <div className="hub-name">Copenhagen</div>
                <div className="status-indicator active"/>
              </Button>
            </Grid>
            <Grid>
              <Button  onClick={changeRoom("Novi Sad")}>
                <div className="images"/>
                <div className="hub-name">Novi Sad</div>
                <div className="status-indicator active"/>
              </Button>
            </Grid>
            <Grid>
              <Button  onClick={changeRoom("Banja Luka")}>
                <div className="images"/>
                <div className="hub-name">Banja Luka</div>
                <div className="status-indicator no-guest"/>
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={2} sm={4} md={4}>
            <Grid>
              <Button  onClick={changeRoom("Sofia")}>
                <div className="images"/>
                <div className="hub-name">Sofia</div>
                <div className="status-indicator has-guest"/>
              </Button>
            </Grid>
            <Grid>
              <Button  onClick={changeRoom("Beograd")}>
                <div className="images"/>
                <div className="hub-name">Beograd</div>
                <div className="status-indicator no-guest"/>
              </Button>
            </Grid>
            <Grid>
              <Button  disabled>
                <div className="images"/>
                <div className="hub-name">Kragujevac</div>
                <div className="status-indicator offline"/>
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={2} sm={4} md={4}>
            <Grid>
              <Button  onClick={changeRoom("Yerevan")}>
                <div className="images"/>
                <div className="hub-name">Yerevan</div>
                <div className="status-indicator has-guest"/>
              </Button>
            </Grid>
            <Grid>
              <Button disabled>
                <div className="images"/>
                <div className="hub-name">Sarajevo</div>
                <div className="status-indicator offline"/>
              </Button>
            </Grid>
            <Grid>
              <Button  onClick={changeRoom("Novi Sad")}>
                <div className="images"/>
                <div className="hub-name">Novi Sad</div>
                <div className="status-indicator has-guest"/>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
