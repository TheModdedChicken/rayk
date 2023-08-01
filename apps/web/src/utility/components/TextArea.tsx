import './TextArea.css';

function TextArea (props: {
  placeholder?: string
}) {
  return (
    <div class='textarea' role='textbox' contentEditable={true} data-text={props.placeholder} onInput={(e) => {
      const target = e.target;
      if (target.textContent?.replace(/^\s*/, "").replace(/\s*$/, "") === "") target.textContent = null;
    }}></div>
  );
}

export default TextArea