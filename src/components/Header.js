import React from 'react';
import {AppBar, Button, Grid, IconButton, Toolbar} from "@mui/material";

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
              <Button>
                <div className="images"/>
                <div className="hub-name">Copenhagen</div>
                <div className="status-indicator active"/>
              </Button>
            </Grid>
            <Grid>
              <Button>
                <div className="images"/>
                <div className="hub-name">Novi Sad</div>
                <div className="status-indicator active"/>
              </Button>
            </Grid>
            <Grid>
              <Button>
                <div className="images"/>
                <div className="hub-name">Banja Luka</div>
                <div className="status-indicator no-guest"/>
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={2} sm={4} md={4}>
            <Grid>
              <Button>
                <div className="images"/>
                <div className="hub-name">Sofia</div>
                <div className="status-indicator has-guest"/>
              </Button>
            </Grid>
            <Grid>
              <Button>
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
              <Button>
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
              <Button>
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
