import type { Metadata } from "next";
import { OceanDiveGame } from "@/components/games/OceanDiveGame";

export const metadata: Metadata = {
  title: "Ocean Dive - Explore the Underwater World",
  description: "Dive into the ocean and discover hidden treasures!",
};

export default function OceanDivePage() {
  return <OceanDiveGame />;
}
