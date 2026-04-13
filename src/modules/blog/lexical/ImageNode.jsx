// ═══════════════════════════════════════════════════════════════════════════════
// Image Node for Lexical
// ═══════════════════════════════════════════════════════════════════════════════ 

/* eslint-disable react-refresh/only-export-components */

import { DecoratorNode, createCommand } from "lexical";

export class ImageNode extends DecoratorNode {
  static getType() { return "image"; }
  static clone(node) { return new ImageNode(node.__src, node.__alt, node.__width, node.__key); }

  constructor(src, alt = "", width = "100%", key) {
    super(key);
    this.__src   = src;
    this.__alt   = alt;
    this.__width = width;
  }

  static importJSON(data) {
    return new ImageNode(data.src, data.alt, data.width);
  }

  exportJSON() {
    return { type: "image", version: 1, src: this.__src, alt: this.__alt, width: this.__width };
  }

  // ↓ هذه الدالة هي الحل — بدونها $generateHtmlFromNodes لا يعرف كيف يحوّل
  //   هذه العقدة إلى HTML، فيتجاهلها تمامًا ولا تظهر الصورة في صفحة العرض
  exportDOM() {
    const img = document.createElement("img");
    img.setAttribute("src",   this.__src);
    img.setAttribute("alt",   this.__alt);
    img.style.maxWidth    = "100%";
    img.style.width       = this.__width;
    img.style.borderRadius = "0.5rem";
    img.style.display     = "block";
    img.style.margin      = "1rem 0";
    return { element: img };
  }

  static importDOM() {
    return {
      img: () => ({
        conversion: (domNode) => {
          if (domNode instanceof HTMLImageElement) {
            return {
              node: new ImageNode(
                domNode.getAttribute("src")   || "",
                domNode.getAttribute("alt")   || "",
                domNode.style.width           || "100%",
              ),
            };
          }
          return null;
        },
        priority: 0,
      }),
    };
  }

  createDOM() {
    const span = document.createElement("span");
    span.style.display = "block";
    return span;
  }

  updateDOM() { return false; }

  decorate() {
    return (
      <span contentEditable={false} style={{ display: "block", margin: "1rem 0", userSelect: "none" }}>
        <img
          src={this.__src}
          alt={this.__alt}
          style={{ maxWidth: "100%", width: this.__width, borderRadius: "0.5rem", display: "block" }}
        />
      </span>
    );
  }
} 



export function $createImageNode(src, alt, width) {
  return new ImageNode(src, alt, width);
} 

// Insert image command
export const INSERT_IMAGE_COMMAND = createCommand("INSERT_IMAGE_COMMAND"); 
 

