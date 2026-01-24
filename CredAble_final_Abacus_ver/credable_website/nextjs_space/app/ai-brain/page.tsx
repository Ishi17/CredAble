'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Info, X, Play, Pause, ChevronRight } from 'lucide-react';

const NeuralNetworkViz = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodesRef = useRef<any[]>([]);
  const connectionsRef = useRef<any[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isAutoTour, setIsAutoTour] = useState(false);

  // UI step index (for display)
  const [currentLayerIndex, setCurrentLayerIndex] = useState(0);

  // Cursor only (visual); real drag state is in refs so we don't re-mount Three.js
  const [isDraggingUI, setIsDraggingUI] = useState(false);

  // ===== Interaction refs (no re-render fights) =====
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const cameraAnglesRef = useRef({ theta: 0.8, phi: 0.5 });

  // ===== TOUR STATE (persistent, does not reset) =====
  const isTourActiveRef = useRef(false);
  const tourStepRef = useRef(0);
  const isCameraAnimatingRef = useRef(false);
  const allowClickZoomRef = useRef(true);
  const allowDragRef = useRef(true);

  // CredAble AI Brain - 5 layers
  const networkLayers = [
    {
      name: 'Layer 1 — Perception',
      nodeCount: 24,
      color: 0x4a9eff,
      z: -60,
      description:
        'What CredAble sees: Bank transactions & cash flows, GST/tax signals, financial statements, invoices (payables & receivables), BRE outputs & application docs.'
    },
    {
      name: 'Layer 2 — Understanding',
      nodeCount: 28,
      color: 0x7c3aed,
      z: -30,
      description:
        'What CredAble understands: Normalize entities (customers, suppliers), compute ratios & cycles (DSO/DPO/CCC), detect seasonality & volatility, link documents to facts, coverage + confidence per signal.'
    },
    {
      name: 'Layer 3 — Reasoning',
      nodeCount: 32,
      color: 0x9d4edd,
      z: 0,
      description:
        'What CredAble infers: Signals → inferences → implications, concentration + stress detection, inconsistency checks, early warning triggers, explainable chains with confidence.'
    },
    {
      name: 'Layer 4 — Judgment',
      nodeCount: 26,
      color: 0xc77dff,
      z: 30,
      description:
        'What CredAble decides: Policy alignment & exceptions, risk appetite fit, scenario sensitivity, confidence rings + assumptions, human override + audit trail.'
    },
    {
      name: 'Layer 5 — Action',
      nodeCount: 18,
      color: 0xf7931e,
      z: 60,
      description:
        'What CredAble produces: Draft CAM paragraphs, recommended covenants, red flags & follow-ups, decision-ready summary, notifications for maker/checker.'
    }
  ];

  // ---- Helpers: camera animation gate ----
  const animateCamera = (
    camera: THREE.PerspectiveCamera,
    targetPos: THREE.Vector3,
    lookAtPos: THREE.Vector3,
    duration = 1500,
    onDone?: () => void
  ) => {
    isCameraAnimatingRef.current = true;

    const startPos = camera.position.clone();
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      camera.position.lerpVectors(startPos, targetPos, eased);
      camera.lookAt(lookAtPos);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        isCameraAnimatingRef.current = false;
        onDone?.();
      }
    };

    tick();
  };

  // ---- Tour: 5-step controlled zoom ----
  const startTour = () => {
    isTourActiveRef.current = true;
    tourStepRef.current = 0;

    // lock interactions during the tour
    allowClickZoomRef.current = false;
    allowDragRef.current = false;
    setIsAutoTour(false);
    setSelectedNode(null);

    goToLayer(0, { fromTour: true });
  };

  const nextTourStep = () => {
    if (!isTourActiveRef.current) {
      startTour();
      return;
    }
    if (isCameraAnimatingRef.current) return;

    const next = tourStepRef.current + 1;

    // End after 5 layers
    if (next >= networkLayers.length) {
      endTour();
      return;
    }

    tourStepRef.current = next;
    goToLayer(next, { fromTour: true });
  };

  const endTour = () => {
    isTourActiveRef.current = false;

    // re-enable interactions
    allowClickZoomRef.current = true;
    allowDragRef.current = true;

    // optional: leave camera where it ended; user can drag now
    // If you want to return to default view on end, call closePopup() or similar.
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    scene.fog = new THREE.Fog(0x0a0e27, 80, 200);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(60, 40, 100);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const pointLight1 = new THREE.PointLight(0x4a9eff, 1, 100);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff6b35, 1, 100);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight2);

    // Create network
    const nodes: any[] = [];
    const connections: any[] = [];

    networkLayers.forEach((layer, layerIndex) => {
      const layerNodes: any[] = [];
      const radius = layer.nodeCount * 2.5;

      for (let i = 0; i < layer.nodeCount; i++) {
        const angle = (i / layer.nodeCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const geometry = new THREE.SphereGeometry(0.8, 16, 16);
        const material = new THREE.MeshStandardMaterial({
          color: layer.color,
          emissive: layer.color,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 0.3
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(x, y, layer.z);

        const glowGeometry = new THREE.SphereGeometry(1.2, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        sphere.add(glow);

        scene.add(sphere);

        layerNodes.push({
          mesh: sphere,
          layerIndex,
          nodeIndex: i,
          layer,
          baseEmissive: 0.3
        });

        if (layerIndex > 0) {
          const prevLayer = nodes[layerIndex - 1];
          prevLayer.forEach((prevNode: any) => {
            const points = [prevNode.mesh.position, sphere.position];
            const g = new THREE.BufferGeometry().setFromPoints(points);
            const m = new THREE.LineBasicMaterial({ color: 0x4a9eff, transparent: true, opacity: 0.15 });
            const line = new THREE.Line(g, m);
            scene.add(line);
            connections.push({ line, material: m });
          });
        }
      }

      nodes.push(layerNodes);
    });

    nodesRef.current = nodes;
    connectionsRef.current = connections;

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const zoomToNode = (nodeData: any) => {
      if (!cameraRef.current) return;

      const targetPos = nodeData.mesh.position.clone();
      const offset = new THREE.Vector3(0, 0, 25);
      const newCameraPos = targetPos.clone().add(offset);

      // lock camera drift while animating
      animateCamera(cameraRef.current, newCameraPos, targetPos);

      // highlight
      nodesRef.current.flat().forEach((n: any) => {
        n.baseEmissive = 0.3;
        n.mesh.material.emissiveIntensity = 0.3;
      });
      nodeData.baseEmissive = 1.0;
    };

    const onMouseClick = (event: MouseEvent) => {
      // 🚫 Disable click-zoom during tour
      if (!allowClickZoomRef.current || isTourActiveRef.current) return;

      // also avoid click while dragging
      if (isDraggingRef.current) return;

      const cam = cameraRef.current;
      if (!cam) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, cam);

      const allMeshes = nodesRef.current.flat().map((n: any) => n.mesh);
      const intersects = raycaster.intersectObjects(allMeshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const nodeData = nodesRef.current.flat().find((n: any) => n.mesh === clickedMesh);
        if (nodeData) {
          setSelectedNode(nodeData);
          setIsAutoTour(false);
          zoomToNode(nodeData);
        }
      }
    };

    // Drag handling
    const onMouseDown = (event: MouseEvent) => {
      // 🚫 Disable drag during tour
      if (!allowDragRef.current || isTourActiveRef.current) return;

      isDraggingRef.current = true;
      setIsDraggingUI(true);
      dragStartRef.current = { x: event.clientX, y: event.clientY };
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current) return;
      if (!allowDragRef.current || isTourActiveRef.current) return;

      const deltaX = event.clientX - dragStartRef.current.x;
      const deltaY = event.clientY - dragStartRef.current.y;

      const prev = cameraAnglesRef.current;

      cameraAnglesRef.current = {
        theta: prev.theta + deltaX * 0.005,
        phi: Math.max(0.1, Math.min(Math.PI - 0.1, prev.phi + deltaY * 0.005))
      };

      dragStartRef.current = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      setIsDraggingUI(false);
    };

    // Animate
    let time = 0;
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Pulses
      nodesRef.current.forEach((layer: any, layerIndex: number) => {
        layer.forEach((node: any, nodeIndex: number) => {
          const pulse = Math.sin(time * 2 + nodeIndex * 0.5 + layerIndex) * 0.2 + 0.3;
          node.mesh.material.emissiveIntensity = node.baseEmissive + pulse * 0.2;
          (node.mesh.children[0] as any).material.opacity = 0.1 + pulse * 0.1;
        });
      });

      // Connections
      connectionsRef.current.forEach((conn: any, index: number) => {
        const pulse = Math.sin(time * 3 + index * 0.1) * 0.1 + 0.15;
        conn.material.opacity = pulse;
      });

      // Camera drift ONLY when idle (no selection, no tour, no animating)
      if (!selectedNode && !isAutoTour && !isTourActiveRef.current && !isCameraAnimatingRef.current) {
        const radius = 120;
        let { theta, phi } = cameraAnglesRef.current;

        // gentle drift only if not dragging
        if (!isDraggingRef.current) {
          theta += Math.sin(time * 0.15) * 0.3;
          phi += Math.cos(time * 0.2) * 0.2;
        }

        camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
        camera.position.y = radius * Math.cos(phi);
        camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };
    animate();

    containerRef.current.addEventListener('click', onMouseClick);
    containerRef.current.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (containerRef.current) {
        containerRef.current.removeEventListener('click', onMouseClick);
        containerRef.current.removeEventListener('mousedown', onMouseDown);
      }

      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (rendererRef.current && containerRef.current) containerRef.current.removeChild(rendererRef.current.domElement);
    };
    // IMPORTANT: do not remount Three.js on drag; keep this effect one-time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto tour effect (your old feature remains, but Next-tour is separate)
  useEffect(() => {
    if (!isAutoTour) return;

    const interval = setInterval(() => {
      setCurrentLayerIndex((prev) => {
        const next = (prev + 1) % networkLayers.length;
        goToLayer(next, { fromTour: false });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoTour]);

  // Go to layer (works for auto tour + Next tour)
  const goToLayer = (layerIndex: number, opts?: { fromTour: boolean }) => {
    if (!nodesRef.current[layerIndex] || !cameraRef.current) return;

    const layer = nodesRef.current[layerIndex];
    const layerInfo = networkLayers[layerIndex];

    setCurrentLayerIndex(layerIndex);
    setSelectedNode(layer[0]);

    const camera = cameraRef.current;

    const targetPos = new THREE.Vector3(0, 0, layerInfo.z);
    const offset = new THREE.Vector3(0, 0, 35);
    const newCameraPos = targetPos.clone().add(offset);

    animateCamera(camera, newCameraPos, targetPos, 1500);

    // highlight layer
    nodesRef.current.flat().forEach((n: any) => {
      n.baseEmissive = 0.3;
      n.mesh.material.emissiveIntensity = 0.3;
    });
    layer.forEach((node: any) => {
      node.baseEmissive = 0.8;
    });
  };

  // Next button now runs the 5-step tour
  const goToNextNode = () => {
    setIsAutoTour(false);
    nextTourStep();
  };

  const closePopup = () => {
    setSelectedNode(null);

    // if tour is active, ignore close (tour controls the camera)
    if (isTourActiveRef.current) return;

    if (cameraRef.current) {
      const camera = cameraRef.current;
      const targetPos = new THREE.Vector3(60, 40, 100);
      const startPos = camera.position.clone();
      const startTime = Date.now();
      const duration = 1500;

      isCameraAnimatingRef.current = true;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        camera.position.lerpVectors(startPos, targetPos, eased);
        camera.lookAt(0, 0, 0);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isCameraAnimatingRef.current = false;

          // sync angles
          const radius = 120;
          const x = 60,
            y = 40,
            z = 100;
          const phi = Math.acos(y / radius);
          const theta = Math.atan2(z, x);
          cameraAnglesRef.current = { theta, phi };
        }
      };
      animate();
    }
  };

  return (
    <div className="relative w-full h-screen pt-14 overflow-hidden bg-slate-900">
      <div ref={containerRef} className="w-full h-full" style={{ cursor: isDraggingUI ? 'grabbing' : 'grab' }} />

      {/* UI Overlay */}
      <div className="absolute top-20 left-8 text-white z-10">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400">
          CredAble AI Brain
        </h1>
        <p className="text-gray-300 text-sm">
          Drag to rotate • Click nodes to explore • Press Next to run the 5-layer guided tour
        </p>
      </div>

      {/* Controls - Bottom Left */}
      <div className="absolute bottom-8 left-8 z-10 flex gap-2">
        <button
          onClick={goToNextNode}
          className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/20 transition flex items-center gap-2"
        >
          <ChevronRight size={16} />
          Next
        </button>
        <button
          onClick={() => setIsAutoTour(!isAutoTour)}
          className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/20 transition flex items-center gap-2"
        >
          {isAutoTour ? <Pause size={16} /> : <Play size={16} />}
          {isAutoTour ? 'Pause Tour' : 'Auto Tour'}
        </button>
      </div>

      {/* Info Popup */}
      {selectedNode && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800/95 backdrop-blur-xl text-white p-6 rounded-2xl shadow-2xl max-w-md z-20 border border-white/10">
          <button onClick={closePopup} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
            <X size={20} />
          </button>

          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `#${selectedNode.layer.color.toString(16)}` }}
            >
              <Info size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">{selectedNode.layer.name}</h3>
              <p className="text-sm text-gray-400">
                Node {selectedNode.nodeIndex + 1} of {selectedNode.layer.nodeCount}
              </p>
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed">{selectedNode.layer.description}</p>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Layer Position:</span>
              <span className="text-white font-mono">Z: {selectedNode.layer.z}</span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-8 right-8 bg-slate-800/80 backdrop-blur-md text-white p-4 rounded-lg z-10 text-sm">
        <h4 className="font-semibold mb-2">Network Layers</h4>
        {networkLayers.map((layer, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${layer.color.toString(16)}` }} />
            <span className="text-gray-300">{layer.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeuralNetworkViz;
