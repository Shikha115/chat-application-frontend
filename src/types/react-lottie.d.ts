declare module "react-lottie" {
  import * as React from "react";

  export interface LottieOptions {
    loop?: boolean;
    autoplay?: boolean;
    animationData: any;
    rendererSettings?: object;
  }

  export interface LottieProps {
    options: LottieOptions;
    height?: number | string;
    width?: number | string;
    isStopped?: boolean;
    isPaused?: boolean;
    eventListeners?: Array<{ eventName: string; callback: () => void }>;
    style?: React.CSSProperties;
    direction?: 1 | -1;
    speed?: number;
    segments?: number[] | number[][];
    forceSegments?: boolean;
  }

  export default class Lottie extends React.Component<LottieProps> {}
}
