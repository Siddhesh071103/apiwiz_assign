let idCounter = 0;

function pathSegmentsToString(segments) {
  if (!segments || segments.length === 0) return "$";
  let out = "$";
  segments.forEach((seg) => {
    if (typeof seg === "number") out += `[${seg}]`;
    else out += `.${seg}`;
  });
  return out;
}

export function jsonToFlow(rootJson) {
  idCounter = 0;
  const nodes = [];
  const edges = [];
  const pathMap = {};
  let yCounter = 0;

  function addNode({ labelJSX, labelText, type, pathSegs, value, depth }) {
    const id = `n-${idCounter++}`;
    const x = depth * 240;
    const y = yCounter * 80;
    yCounter += 1;

    const pathStr = pathSegmentsToString(pathSegs);
    pathMap[pathStr] = id;

    const baseStyle = {
      borderRadius: 8,
      padding: 8,
      minWidth: 110,
      border: "1px solid #666",
      boxSizing: "border-box",
      fontSize: 12,
    };

    let bg = "#ffdca8"; // primitive
    if (type === "object") bg = "#c7d2ff";
    if (type === "array") bg = "#c8f7d6";

    nodes.push({
      id,
      type: "default",
      position: { x, y },
      data: {
        label: labelJSX ?? labelText,
        path: pathStr,
        value,
        rawType: type,
      },
      style: { ...baseStyle, background: bg },
    });

    return id;
  }

  function walk(value, pathSegs = [], depth = 0, parentId = null, keyLabel = null) {
    const valType =
      value === null ? "primitive" : Array.isArray(value) ? "array" : typeof value === "object" ? "object" : "primitive";

    if (valType === "object") {
      const nodeId = addNode({
        labelJSX: (
          <div title={`${pathSegmentsToString(pathSegs)}\n(object)`} style={{ whiteSpace: "nowrap" }}>
            <strong>{keyLabel ?? "Object"}</strong>
          </div>
        ),
        labelText: keyLabel ? `${keyLabel} (object)` : "Object",
        type: "object",
        pathSegs,
        value: null,
        depth,
      });

      if (parentId) edges.push({ id: `e-${parentId}-${nodeId}`, source: parentId, target: nodeId });
      Object.entries(value).forEach(([k, v]) => walk(v, [...pathSegs, k], depth + 1, nodeId, k));
      return nodeId;
    }

    if (valType === "array") {
      const nodeId = addNode({
        labelJSX: (
          <div title={`${pathSegmentsToString(pathSegs)}\n(array)`} style={{ whiteSpace: "nowrap" }}>
            <strong>{keyLabel ?? "Array"}</strong>
          </div>
        ),
        labelText: keyLabel ? `${keyLabel} (array)` : "Array",
        type: "array",
        pathSegs,
        value: null,
        depth,
      });

      if (parentId) edges.push({ id: `e-${parentId}-${nodeId}`, source: parentId, target: nodeId });
      value.forEach((item, idx) => walk(item, [...pathSegs, idx], depth + 1, nodeId, `[${idx}]`));
      return nodeId;
    }

    const valStr = value === null ? "null" : String(value);
    const primitiveLabel = keyLabel ? (
      <div title={`${pathSegmentsToString(pathSegs)}\n${valStr}`} style={{ whiteSpace: "nowrap" }}>
        <strong style={{ color: "#c2410c" }}>{keyLabel}:</strong>&nbsp;
        <span style={{ fontFamily: "monospace" }}>{valStr}</span>
      </div>
    ) : (
      <div title={`${pathSegmentsToString(pathSegs)}\n${valStr}`} style={{ whiteSpace: "nowrap" }}>
        <span style={{ fontFamily: "monospace" }}>{valStr}</span>
      </div>
    );

    const nodeId = addNode({
      labelJSX: primitiveLabel,
      labelText: primitiveLabel,
      type: "primitive",
      pathSegs,
      value,
      depth,
    });

    if (parentId) edges.push({ id: `e-${parentId}-${nodeId}`, source: parentId, target: nodeId });
    return nodeId;
  }

  walk(rootJson, [], 0, null, null);
  return { nodes, edges, pathMap };
}
