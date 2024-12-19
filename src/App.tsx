import {useRef, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Canvas, useFrame} from "@react-three/fiber";
import {Asdf} from "./1/Box.tsx";
import {OrbitControls} from "@react-three/drei";
import { Scad } from './2/Scad.tsx';

function App() {
  const [count, setCount] = useState(0)

  return (
      <Canvas>
          <ambientLight intensity={Math.PI / 2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
          <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
<OrbitControls/>
          <Scad/>
      </Canvas>
  )
}

export default App
