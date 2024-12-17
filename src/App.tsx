import {useRef, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Canvas, useFrame} from "@react-three/fiber";
import {Asdf} from "./Box.tsx";
import {OrbitControls} from "@react-three/drei";

function App() {
  const [count, setCount] = useState(0)

  return (
      <Canvas>
          <ambientLight intensity={Math.PI / 2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
          <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
<OrbitControls/>
          <Asdf/>
      </Canvas>
  )
}

export default App
