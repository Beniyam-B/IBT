import MenuShell from "./MenuShell";

// Nested layout: the sidebar stays mounted while you move between /menu and /menu/[id].
// Server component passing its children into the client shell (pass, do not import).
export default function MenuLayout({ children }) {
  return <MenuShell>{children}</MenuShell>;
}
