import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { Slide01 } from './slides/Slide01_TalentOpportunity';
import { Slide02 } from './slides/Slide02_LaborStat';
import { Slide03 } from './slides/Slide03_SajhaKaamIntro';
import { Slide04 } from './slides/Slide04_ClearTerms';
import { Slide05 } from './slides/Slide05_ProofAgreement';
import { Slide06 } from './slides/Slide06_Workroom';
import { Slide07 } from './slides/Slide07_WorkPassport';
import { Slide08 } from './slides/Slide08_LegalClarity';
import { Slide09 } from './slides/Slide09_Pilot';
import { Slide10 } from './slides/Slide10_Closing';

// Each slide duration at 30fps
// Storyboard-aligned durations (seconds × 30fps):
// Slide 1: 0–10s = 10s = 300 frames
// Slide 2: 10–23s = 13s = 390 frames
// Slide 3: 23–40s = 17s = 510 frames
// Slide 4: 40–51s = 11s = 330 frames
// Slide 5: 51–63s = 12s = 360 frames
// Slide 6: 63–77s = 14s = 420 frames
// Slide 7: 77–88s = 11s = 330 frames
// Slide 8: 88–102s = 14s = 420 frames
// Slide 9: 102–113s = 11s = 330 frames
// Slide 10: 113–120s = 7s = 210 frames
// Total: 120s = 3600 frames

const slides = [
  { Component: Slide01, durationInFrames: 300 },
  { Component: Slide02, durationInFrames: 390 },
  { Component: Slide03, durationInFrames: 510 },
  { Component: Slide04, durationInFrames: 330 },
  { Component: Slide05, durationInFrames: 360 },
  { Component: Slide06, durationInFrames: 420 },
  { Component: Slide07, durationInFrames: 330 },
  { Component: Slide08, durationInFrames: 420 },
  { Component: Slide09, durationInFrames: 330 },
  { Component: Slide10, durationInFrames: 210 },
];

export const SajhaKaamPresentation: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        {slides.map(({ Component, durationInFrames }, i) => (
          <Series.Sequence key={i} durationInFrames={durationInFrames}>
            <AbsoluteFill>
              <Component />
            </AbsoluteFill>
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
