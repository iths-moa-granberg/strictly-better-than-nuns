import React from 'react';
import styles from './LoadingScreen.module.scss';

const LoadingScreen = () => {
  return (
    <section className={styles.loadingWrapper}>
      <svg width="100px" height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <g transform="translate(50 50)">
          <g transform="scale(0.7)">
            <g transform="translate(-50 -50)">
              <g>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  repeatCount="indefinite"
                  values="0 50 50;360 50 50"
                  keyTimes="0;1"
                  dur="0.8928571428571428s"></animateTransform>
                <path fillOpacity="0.8" fill="#1d4a4d" d="M50 50L50 0A50 50 0 0 1 100 50Z"></path>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  repeatCount="indefinite"
                  values="0 50 50;360 50 50"
                  keyTimes="0;1"
                  dur="1.1904761904761905s"></animateTransform>
                <path
                  fillOpacity="0.8"
                  fill="#330f2b"
                  d="M50 50L50 0A50 50 0 0 1 100 50Z"
                  transform="rotate(90 50 50)"></path>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  repeatCount="indefinite"
                  values="0 50 50;360 50 50"
                  keyTimes="0;1"
                  dur="1.7857142857142856s"></animateTransform>
                <path
                  fillOpacity="0.8"
                  fill="#2a6b6f"
                  d="M50 50L50 0A50 50 0 0 1 100 50Z"
                  transform="rotate(180 50 50)"></path>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  repeatCount="indefinite"
                  values="0 50 50;360 50 50"
                  keyTimes="0;1"
                  dur="3.571428571428571s"></animateTransform>
                <path
                  fillOpacity="0.8"
                  fill="#79ccd1"
                  d="M50 50L50 0A50 50 0 0 1 100 50Z"
                  transform="rotate(270 50 50)"></path>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </section>
  );
};

export default LoadingScreen;
