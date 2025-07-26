import * as React from "react";
import type { SVGProps } from "react";

const YoutubeMusicIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx={12} cy={12} r={10} />
    <path d="m10 15.5 4-3.5-4-3.5v7z" />
  </svg>
);
export default YoutubeMusicIcon;
