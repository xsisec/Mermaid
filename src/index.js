import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import MDEditor from "@uiw/react-md-editor";
import mermaid from "mermaid";

const mdMermaid = `The following are some examples of the diagrams, charts and graphs that can be made using Mermaid and the Markdown-inspired text specific to it. 

\`\`\`mermaid
graph TD
A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Two| E[Result 2]
\`\`\`

\`\`\`mermaid
sequenceDiagram
Alice->>John: Hello John, how are you?
loop Healthcheck
    John->>John: Fight against hypochondria
end
Note right of John: Rational thoughts!
John-->>Alice: Great!
John->>Bob: How about you?
Bob-->>John: Jolly good!
\`\`\`
`;

const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);

const Code = ({ inline, children = [], className, ...props }) => {
  const demoid = useRef(`dome${randomid()}`);
  const code = getCode(children);
  const demo = useRef(null);
  const handle = useCallback(async () => {
    if (demo.current) {
      try {
        const { svg } = await mermaid.render(demoid.current, code);
        demo.current.innerHTML = svg;
      } catch (error) {
        demo.current.innerHTML = error;
      }
    }
  }, [demo, code]);

  useEffect(() => handle(), [handle]);

  if (
    typeof code === "string" &&
    typeof className === "string" &&
    /^language-mermaid/.test(className.toLocaleLowerCase())
  ) {
    return (
      <code ref={demo}>
        <code id={demoid.current} style={{ display: "none" }} />
      </code>
    );
  }
  return <code className={String(className)}>{children}</code>;
};

const getCode = (arr = []) =>
  arr
    .map((dt) => {
      if (typeof dt === "string") {
        return dt;
      }
      if (dt.props && dt.props.children) {
        return getCode(dt.props.children);
      }
      return false;
    })
    .filter(Boolean)
    .join("");

export default function App() {
  const [value, setValue] = useState(mdMermaid);
  return (
    <React.Fragment>
      <div data-color-mode="dart">
        <MDEditor
          onChange={(newValue = "") => setValue(newValue)}
          textareaProps={{
            placeholder: "Please enter Markdown text"
          }}
          height={500}
          value={value}
          previewOptions={{
            components: {
              code: Code
            }
          }}
        />
      </div>

      <div data-color-mode="light">
        <MDEditor
          onChange={(newValue = "") => setValue(newValue)}
          textareaProps={{
            placeholder: "Please enter Markdown text"
          }}
          height={500}
          value={value}
          previewOptions={{
            components: {
              code: Code
            }
          }}
        />
      </div>
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.getElementById("container"));
