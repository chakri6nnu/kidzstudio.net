import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Image from '@editorjs/image';
import LinkTool from '@editorjs/link';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';

interface EditorProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

export interface EditorRef {
  save: () => Promise<OutputData>;
  clear: () => Promise<void>;
  getEditor: () => EditorJS | undefined;
}

const Editor = forwardRef<EditorRef, EditorProps>(({
  data,
  onChange,
  placeholder = "Let's write an awesome content!",
  readOnly = false,
  className = "",
}, ref) => {
  const editorRef = useRef<EditorJS>();
  const holderRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useImperativeHandle(ref, () => ({
    save: async () => {
      if (editorRef.current) {
        return await editorRef.current.save();
      }
      throw new Error('Editor not initialized');
    },
    clear: async () => {
      if (editorRef.current) {
        await editorRef.current.clear();
      } else {
        throw new Error('Editor not initialized');
      }
    },
    getEditor: () => {
      return editorRef.current;
    },
  }));

  useEffect(() => {
    if (!holderRef.current || isInitialized.current) return;

    const editor = new EditorJS({
      holder: holderRef.current,
      data: data || {
        time: Date.now(),
        blocks: [],
        version: "2.28.2"
      },
      readOnly,
      placeholder,
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2
          }
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
          config: {
            placeholder: 'Tell your story...'
          }
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        image: {
          class: Image,
          config: {
            endpoints: {
              byFile: '/api/upload/image', // Your backend endpoint
              byUrl: '/api/upload/image-url', // Your backend endpoint
            }
          }
        },
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: '/api/fetch-url', // Your backend endpoint for link data fetching
          }
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+O',
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: "Quote's author",
          },
        },
        code: {
          class: Code,
          shortcut: 'CMD+SHIFT+D'
        },
        delimiter: {
          class: Delimiter,
        },
      },
      onChange: async () => {
        if (onChange && editorRef.current) {
          try {
            const outputData = await editorRef.current.save();
            onChange(outputData);
          } catch (error) {
            console.error('Error saving editor data:', error);
          }
        }
      },
      onReady: () => {
        console.log('Editor.js is ready to work!');
      },
    });

    editorRef.current = editor;
    isInitialized.current = true;

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = undefined;
        isInitialized.current = false;
      }
    };
  }, []);

  // Update data when prop changes
  useEffect(() => {
    if (editorRef.current && data) {
      editorRef.current.render(data);
    }
  }, [data]);

  return (
    <div className={`editor-wrapper ${className}`}>
      <div
        ref={holderRef}
        className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[200px] border border-input rounded-md p-4 bg-background"
        style={{
          fontSize: '16px',
          lineHeight: '1.6em',
        }}
      />
      <EditorStyles />
    </div>
  );
});

// Separate component for styles to avoid JSX issues
const EditorStyles = () => (
  <style>{`
    .codex-editor__redactor {
      padding-bottom: 0 !important;
    }
    .ce-block__content,
    .ce-toolbar__content {
      max-width: none !important;
    }
    .ce-toolbar__actions {
      right: 15px;
    }
    .ce-inline-toolbar {
      background: hsl(var(--background));
      border: 1px solid hsl(var(--border));
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }
    .ce-inline-toolbar__buttons {
      color: hsl(var(--foreground));
    }
    .ce-conversion-toolbar {
      background: hsl(var(--background));
      border: 1px solid hsl(var(--border));
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }
    .ce-settings {
      background: hsl(var(--background));
      border: 1px solid hsl(var(--border));
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }
    .ce-toolbox {
      background: hsl(var(--background));
      border: 1px solid hsl(var(--border));
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }
    .ce-toolbar__plus {
      color: hsl(var(--muted-foreground));
    }
    .ce-toolbar__plus:hover {
      background: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }
    .ce-toolbar__settings-btn {
      color: hsl(var(--muted-foreground));
    }
    .ce-toolbar__settings-btn:hover {
      background: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }
    .ce-block--selected .ce-block__content {
      background: hsl(var(--accent) / 0.1);
    }
    .ce-paragraph {
      color: hsl(var(--foreground));
    }
    .ce-header {
      color: hsl(var(--foreground));
    }
    .cdx-quote {
      color: hsl(var(--foreground));
    }
    .cdx-quote__text {
      color: hsl(var(--foreground));
    }
    .cdx-list {
      color: hsl(var(--foreground));
    }
    .ce-code__textarea {
      background: hsl(var(--muted));
      color: hsl(var(--foreground));
      border: 1px solid hsl(var(--border));
    }
    .tc-table {
      border-color: hsl(var(--border));
    }
    .tc-cell {
      border-color: hsl(var(--border));
      color: hsl(var(--foreground));
    }
    .tc-toolbox {
      background: hsl(var(--background));
      border: 1px solid hsl(var(--border));
    }
    .cdx-search-field {
      background: hsl(var(--background));
      border: 1px solid hsl(var(--border));
      color: hsl(var(--foreground));
    }
    .cdx-settings-button {
      color: hsl(var(--foreground));
    }
    .cdx-settings-button:hover {
      background: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }
  `}</style>
);

Editor.displayName = 'Editor';

export default Editor;