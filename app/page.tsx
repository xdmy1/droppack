import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: "https://droppack.md/ro/" },
};

export default function RootRedirect() {
  return (
    <html lang="ro">
      <head>
        <meta httpEquiv="refresh" content="0; url=/ro/" />
        <link rel="canonical" href="/ro/" />
        <title>DropPack</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=(navigator.language||'ro').slice(0,2).toLowerCase();var t=l==='ru'?'/ru/':'/ro/';location.replace(t);}catch(e){location.replace('/ro/');}})();`,
          }}
        />
      </head>
      <body>
        <a href="/ro/">DropPack</a>
      </body>
    </html>
  );
}
