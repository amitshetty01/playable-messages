"use client";

import { useGLTF } from "@react-three/drei";
import { Suspense, useMemo, type ReactNode } from "react";

import { OCEAN_MODEL_ASSETS, type OceanAssetKey } from "./assetManifest";

interface ModelSlotProps {
  assetKey: OceanAssetKey;
  children: ReactNode;
  [key: string]: unknown;
}

function LoadedModel({ path }: { path: string }) {
  const gltf = useGLTF(path);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  return <primitive object={scene} />;
}

export function ModelSlot({ assetKey, children, ...props }: ModelSlotProps) {
  const asset = OCEAN_MODEL_ASSETS[assetKey];

  if (!asset.ready) {
    return <group {...props}>{children}</group>;
  }

  return (
    <group {...props}>
      <Suspense fallback={children}>
        <LoadedModel path={asset.path} />
      </Suspense>
    </group>
  );
}
