import { cls, up } from "./util";

export interface HierarchyNode {
  label: string;
  code?: string;
  /** Signal fill; one per tree. */
  active?: boolean;
  children?: HierarchyNode[];
}

export interface HierarchyProps {
  /** The root renders on the inverse fill. */
  root?: HierarchyNode | null;
  title?: string;
  className?: string;
}

function TreeNode({ node, depth }: { node: HierarchyNode; depth: number }) {
  const kids = node.children || [];
  return (
    <li>
      <div className={cls("ds-tree-node", depth === 0 && "ds-tree-root", node.active && "ds-tree-on")}>
        {node.code ? <span className="label ds-tree-code">{up(node.code)}</span> : null}
        <span className="body ds-tree-label">{node.label}</span>
      </div>
      {kids.length ? (
        <ul>
          {kids.map((c, i) => (
            <TreeNode key={i} node={c} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/** Port of Dossier's Hierarchy: a top-down tree of square nodes with orthogonal connectors. */
export function Hierarchy({ root, title, className }: HierarchyProps) {
  if (!root) return null;
  return (
    <div className={cls("ds-tree", className)} aria-label={title || "Hierarchy"}>
      <ul>
        <TreeNode node={root} depth={0} />
      </ul>
    </div>
  );
}
