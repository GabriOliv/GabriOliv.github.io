import { cls, up } from "./util";

export interface TagProps {
  /** outline (default) = neutral; solid = signal, the active state; inverse = archived or restricted. */
  variant?: "outline" | "solid" | "inverse";
  children: string;
  className?: string;
}

/** Port of Dossier's Tag: a square label. */
export function Tag({ variant, children, className }: TagProps) {
  const v = variant === "solid" || variant === "inverse" ? variant : "outline";
  return <span className={cls("label", "ds-tag", "ds-tag-" + v, className)}>{up(children)}</span>;
}
