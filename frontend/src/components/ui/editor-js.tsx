import React, { useRef, useCallback, useEffect, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import "./editor-js.css";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import Warning from "@editorjs/warning";
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Raw from "@editorjs/raw";
import Code from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import Embed from "@editorjs/embed";
import Checklist from "@editorjs/checklist";
import Underline from "@editorjs/underline";

interface EditorJsProps {
  data?: any;
  onChange?: (data: any) => void;
  placeholder?: string;
  className?: string;
}

export function EditorJs({
  data,
  onChange,
  placeholder = "Start writing...",
  className = "",
}: EditorJsProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const isInitialized = useRef(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Store initial data in a ref that doesn't change after first render
  // This ensures EditorJS is initialized with the correct data only once.
  const initialDataRef = useRef(data);

  // Keep onChange ref up to date
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Detect theme changes
  useEffect(() => {
    const detectTheme = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(isDark ? "dark" : "light");
    };

    detectTheme();

    // Listen for theme changes
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", detectTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", detectTheme);
    };
  }, []);

  const initEditor = useCallback(async () => {
    if (isInitialized.current || editorRef.current) {
      return; // Already initialized
    }

    try {
      editorRef.current = new EditorJS({
        holder: holderRef.current!,
        placeholder,
        data:
          initialDataRef.current && initialDataRef.current.blocks
            ? initialDataRef.current
            : {},
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: "Enter a header",
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 2,
            },
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Quote's author",
            },
          },
          marker: {
            class: Marker,
            shortcut: "CMD+SHIFT+M",
          },
          code: {
            class: Code,
            shortcut: "CMD+SHIFT+C",
          },
          inlineCode: {
            class: InlineCode,
            shortcut: "CMD+SHIFT+C",
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: Image,
            config: {
              endpoints: {
                byFile: "/api/file-manager/upload",
                byUrl: "/api/file-manager/upload",
              },
            },
          },
          delimiter: Delimiter,
        },
        onChange: async (api) => {
          if (onChangeRef.current) {
            try {
              const outputData = await api.saver.save();
              onChangeRef.current(outputData);
            } catch (error) {
              console.error("Editor.js save error:", error);
            }
          }
        },
      });
      isInitialized.current = true;
    } catch (error) {
      console.error("Error initializing editor:", error);
    }
  }, [placeholder]); // Removed data and onChange from dependencies

  // Initialize editor only once
  React.useEffect(() => {
    initEditor();

    return () => {
      if (editorRef.current) {
        try {
          if (typeof editorRef.current.destroy === "function") {
            editorRef.current.destroy();
          }
        } catch (error) {
          console.warn("Error destroying editor on cleanup:", error);
        }
        editorRef.current = null;
        isInitialized.current = false;
      }
    };
  }, [initEditor]);

  return (
    <div className={`editor-js-container editor-js-${theme} ${className}`}>
      <div ref={holderRef} />
    </div>
  );
}
