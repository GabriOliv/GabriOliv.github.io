export interface Entry {
  name: string;
  url: string;
  description: string;
  language: string;
}

export interface Social {
  name: string;
  handle: string;
  url: string;
  /** The `github` entry carries the GitHub account ID: the file number. */
  id?: number;
}

export interface Tool {
  name: string;
  category: string;
  label: string;
  /** Schematic ring: 1 test code, 2 delivery, 3 infrastructure. */
  layer: 1 | 2 | 3;
  /** Degrees, 0 = 3 o'clock, clockwise. */
  angle: number;
  active?: boolean;
}

export interface Cert {
  name: string;
  issuer: string;
  type: string;
  level: string;
  focus: string;
  /** Name of the certification this one builds on; absent on the root. */
  requires?: string;
}

export interface Profile {
  name: string;
  roles: string[];
  highlight: string;
  focus: string;
  education: string;
}

export interface Data {
  profile: Profile;
  social: Social[];
  suite: string[];
  tools: Tool[];
  skills: Record<string, string>;
  certifications: Cert[];
  projects: Entry[];
  gists: Entry[];
}

/** Same shape as Dossier's Hierarchy node. */
export interface HierarchyNode {
  label: string;
  code?: string;
  active?: boolean;
  children?: HierarchyNode[];
}
