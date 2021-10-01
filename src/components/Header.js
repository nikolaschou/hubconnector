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
        >
          <div className="ui small image" />
        </IconButton>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={2} sm={4} md={4}>
            <Grid>
              <Button>
                <div className="images"/>
                <div className="hub-name">Novi Sad</div>
              </Button>
            </Grid>
            <Grid>
              <Button>
                <div className="images"/>
                <div className="hub-name">Novi Sad</div>
              </Button>
            </Grid>
            <Grid>
              <Button>
                <div className="images"/>
                <div className="hub-name">Novi Sad</div>
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={2} sm={4} md={4}>
            <Grid>
              <Button>
                <div className="images"/>
                <div className="hub-name">Novi Sad</div>
              </Button>
            </Grid>
            <Grid>
              <Button>
                <div className="images"/>
                <div className="hub-name">Novi Sad</div>
              </Button>
            </Grid>
            <Grid>
              <Button>
                <div className="images"/>
                <div className="hub-name">Novi Sad</div>
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={2} sm={4} md={4}>
            <Grid>
              <Button>
                <div className="images"/>
                <div className="hub-name">Novi Sad</div>
              </Button>
            </Grid>
            <Grid>
              <Button>
                <div className="images"/>
                <div className="hub-name">Novi Sad</div>
              </Button>
            </Grid>
            <Grid>
              <Button>
                <div className="images"/>
                <div className="hub-name">Novi Sad</div>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
