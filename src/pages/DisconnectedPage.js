import React from 'react';
import Lottie from 'react-lottie';
import manWatching from '../lotties/man-watching.json';
import {Grid} from "@mui/material";

function DisconnectedPage() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: manWatching,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  return (
    <Grid item style={{paddingTop: "200px"}}>
      <Lottie
        options={defaultOptions}
        height={400}
        width={400}
      />
    </Grid>
  );
}

export default DisconnectedPage;
