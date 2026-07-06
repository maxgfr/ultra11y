// Plain-TS barrel: never an audit target itself (no markup), but real cross-file
// structure the dependency graph must resolve through so `./components` imports
// reach the real component definition in Button.tsx.
export { Button } from "./Button";
