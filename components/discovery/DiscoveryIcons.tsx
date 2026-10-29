import { BookOpen, Camera, Coffee, MessageSquareMore, UsersRound, type LucideIcon } from "lucide-react";

import type { DiscoveryContext } from "@/lib/discovery-presentation";

const contextIcons: Record<DiscoveryContext, LucideIcon> = {
  "after-meeting": MessageSquareMore,
  "group-work": UsersRound,
  "focus-study": BookOpen,
  "casual-break": Coffee,
  "content-creation": Camera,
};

const cafeIcons: Record<string, LucideIcon> = {
  "bangmod-corner-coffee": Coffee,
  "leaf-lab-cafe": BookOpen,
  "table-talk-studio": UsersRound,
  "slow-morning-brew": Coffee,
  "frame-foundry": Camera,
};

export function DiscoveryContextIcon({ context, size = 16 }: { context: DiscoveryContext; size?: number }) {
  const Icon = contextIcons[context];
  return <Icon aria-hidden="true" size={size} strokeWidth={1.8} />;
}

export function CafeVisualIcon({ cafeSlug, size = 24 }: { cafeSlug: string; size?: number }) {
  const Icon = cafeIcons[cafeSlug] ?? Coffee;
  return <Icon aria-hidden="true" size={size} strokeWidth={1.7} />;
}
