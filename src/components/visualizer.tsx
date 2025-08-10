'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type VisualizerProps = {
  audioPlayer: HTMLAudioElement | null;
  preset: 'waveform' | 'bars' | 'particles';
};

export default function Visualizer({ audioPlayer, preset }: VisualizerProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!audioPlayer || !mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audioPlayer);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    camera.position.z = 5;

    let visual: THREE.Object3D;

    if (preset === 'waveform') {
      const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array(bufferLength * 3);
      for (let i = 0; i < bufferLength; i++) {
        vertices[i * 3] = (i / (bufferLength - 1)) * 10 - 5;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      visual = new THREE.Line(geometry, material);
    } else if (preset === 'bars') {
      const group = new THREE.Group();
      for (let i = 0; i < bufferLength; i++) {
        const bar = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 1, 0.1),
          new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        bar.position.x = (i / (bufferLength - 1)) * 10 - 5;
        group.add(bar);
      }
      visual = group;
    } else { // particles
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      for (let i = 0; i < 1000; i++) {
        vertices.push(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10);
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      const material = new THREE.PointsMaterial({ color: 0xff00ff, size: 0.1 });
      visual = new THREE.Points(geometry, material);
    }

    scene.add(visual);

    const animate = () => {
      requestAnimationFrame(animate);

      if (preset === 'waveform') {
        analyser.getByteTimeDomainData(dataArray);
        const vertices = (visual as THREE.Line).geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          vertices[i * 3 + 1] = v * 2 - 1;
        }
        (visual as THREE.Line).geometry.attributes.position.needsUpdate = true;
      } else if (preset === 'bars') {
        analyser.getByteFrequencyData(dataArray);
        (visual as THREE.Group).children.forEach((bar, i) => {
          const scale = dataArray[i] / 128.0;
          (bar as THREE.Mesh).scale.y = scale > 0 ? scale : 0.001;
        });
      } else { // particles
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b) / bufferLength;
        (visual as THREE.Points).rotation.y += 0.001 * (avg / 128);
      }

      renderer.render(scene, camera);
    };

    animate();

    const currentMount = mountRef.current;
    return () => {
      currentMount?.removeChild(renderer.domElement);
    };
  }, [audioPlayer, preset]);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full -z-10" />;
}
