"use client";

import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { uploadBlogImage } from "@/lib/blog-api";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

interface TinyMceBlobInfo {
  blob: () => Blob;
  filename: () => string;
}

interface TinyMceEditorApi {
  ui: { registry: { addButton: (name: string, config: { text: string; tooltip: string; onAction: () => void }) => void } };
  selection: { getNode: () => HTMLElement };
  nodeChanged: () => void;
  fire: (name: string) => void;
  undoManager: { transact: (callback: () => void) => void };
  on: (name: string, callback: (event: { element: HTMLElement }) => void) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  return (
    <div className="w-full bg-white transition-all editor-wrapper">
      <Editor
        tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js"
        value={content}
        onEditorChange={(newContent: string) => onChange(newContent)}
        init={{
          min_height: 760,
          height: "78vh",
          width: '100%',
          menubar: false,
          statusbar: true,
          plugins: [
            "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
            "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
            "table", "wordcount", "quickbars"
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic underline blockquote | " +
            "alignleft aligncenter alignright | " +
            "bullist numlist outdent indent | " +
            "link image table | removeformat | fullscreen preview",
          image_advtab: true,
          image_caption: true,
          object_resizing: "img",
          contextmenu: "link image table",
          quickbars_image_toolbar: "alignleft aligncenter alignright | moveimageup moveimagedown | imageoptions",
          setup: (editor: TinyMceEditorApi) => {
            editor.ui.registry.addButton("moveimageup", {
              text: "Lên",
              tooltip: "Đưa ảnh lên trên một đoạn",
              onAction: () => {
                const image = editor.selection.getNode();
                if (image.nodeName !== "IMG") return;
                const block = image.parentElement;
                const previous = block?.previousElementSibling;
                if (!block || !previous) return;
                editor.undoManager.transact(() => previous.before(block));
                editor.nodeChanged();
              },
            });
            editor.ui.registry.addButton("moveimagedown", {
              text: "Xuống",
              tooltip: "Đưa ảnh xuống dưới một đoạn",
              onAction: () => {
                const image = editor.selection.getNode();
                if (image.nodeName !== "IMG") return;
                const block = image.parentElement;
                const next = block?.nextElementSibling;
                if (!block || !next) return;
                editor.undoManager.transact(() => next.after(block));
                editor.nodeChanged();
              },
            });
            editor.on("NodeChange", (event) => {
              if (event.element.nodeName === "IMG") {
                event.element.setAttribute("draggable", "true");
                event.element.setAttribute("title", "Giữ giữa ảnh và kéo đến vị trí mới");
              }
            });
          },
          content_style: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
              font-size: 16px; 
              line-height: 1.7;
              color: #374151; /* text-gray-700 */
              padding: 2rem;
              max-width: 900px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            @media (min-width: 1024px) {
              body { padding: 3rem 4rem; }
            }
            body.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
              color: #94a3b8;
              font-weight: 400;
            }
            h1, h2, h3, h4, h5, h6 { color: #111827; font-weight: 700; line-height: 1.3; margin-top: 2rem; margin-bottom: 1rem; }
            
            /* H1 is rarely used in body, but keep it */
            h1 { font-size: 2.25rem; }
            
            h2 { 
              font-size: 1.55rem;
              color: #0f172a;
              background: linear-gradient(90deg, #ecfeff 0%, rgba(236, 254, 255, 0) 88%);
              border-left: 4px solid #0891b2;
              padding: 10px 16px;
              border-radius: 0 10px 10px 0;
              margin-top: 2.25rem;
              margin-bottom: 1rem;
            }
            
            h3 { 
              font-size: 1.2rem;
              color: #0f172a;
              border-left: 3px solid #67e8f9;
              padding-left: 0.8rem;
              margin-top: 1.75rem;
              margin-bottom: 0.75rem;
            }

            p { margin-top: 0; margin-bottom: 1rem; }
            img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 2rem 0; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); border: 1px solid #f3f4f6; }
            a { color: #17a2b8; text-decoration: none; }
            a:hover { text-decoration: underline; }
            blockquote { 
              border-left: 4px solid #d1d5db; 
              padding: 12px 20px; 
              color: #4b5563; 
              background: #f9fafb; 
              margin: 1.5rem 0;
            }
            ul, ol { padding-left: 1.5rem; margin-top: 0; margin-bottom: 1rem; }
            ul { list-style-type: disc; }
            ol { list-style-type: decimal; }
            li { margin-bottom: 0.25rem; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; border-radius: 0.5rem; overflow: hidden; }
            table, th, td { border: 1px solid #e5e7eb; }
            th, td { padding: 0.75rem 1rem; text-align: left; }
            th { background-color: #f9fafb; font-weight: 600; color: #374151; }
          `,
          skin: "oxide",
          content_css: "default",
          images_upload_handler: async (blobInfo: TinyMceBlobInfo) => {
            try {
              const file = new File([blobInfo.blob()], blobInfo.filename(), { type: blobInfo.blob().type });
              return await uploadBlogImage(file);
            } catch (error: unknown) {
              const message = error instanceof Error ? error.message : "Unknown error";
              throw new Error("Image upload failed: " + message);
            }
          },
          paste_data_images: true,
        }}
      />
      <style>{`
        .tox-tinymce {
          border: none !important;
          border-radius: 0 !important;
        }
        .tox:not(.tox-tinymce-inline) .tox-editor-header {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
          border-bottom: 1px solid #e2e8f0 !important;
          padding: 8px !important;
        }
        .tox .tox-toolbar__primary {
          background: none !important;
        }
        .tox .tox-mbtn {
          font-weight: 500 !important;
          color: #475569 !important;
        }
        .tox .tox-tbtn {
          color: #475569 !important;
        }
        .tox .tox-tbtn:hover {
          background-color: #f1f5f9 !important;
        }
        .tox-statusbar {
          border-top: 1px solid #e2e8f0 !important;
        }
      `}</style>
    </div>
  );
}
