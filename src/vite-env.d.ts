/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendCustom: (options: {
          templateId: number;
          templateArgs?: Record<string, string>;
        }) => void;
      };
    };
  }

  interface ImportMetaEnv {
    readonly VITE_APP_JAVASCRIPT_KEY: string;
    readonly VITE_KAKAO_TEMPLATE_ID: string;
  }
}

export {};
