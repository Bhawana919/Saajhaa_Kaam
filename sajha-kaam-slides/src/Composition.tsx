import React from "react";
import { Composition } from "remotion";
import { SajhaKaamPresentation } from "./SajhaKaamPresentation";

// Total: 3600 frames at 30fps = 120 seconds
// Matches the exact video storyboard timestamp table

export const SajhaKaamComposition = () => {
  return (
    <Composition
      id="SajhaKaam"
      component={SajhaKaamPresentation}
      durationInFrames={3600}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
