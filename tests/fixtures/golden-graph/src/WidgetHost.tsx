// EXTENSIONLESS import of a .vue SFC — resolving "./Widget" to Widget.vue needs the
// .vue candidate probe (a resolver surface the goldens must pin).
import Widget from "./Widget";

export default function WidgetHost() {
  return <Widget />;
}
