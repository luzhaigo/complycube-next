import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href={process.env.COMPLYCUBE_STYLESHEET} />
        <script defer src={process.env.COMPLYCUBE_SCRIPT}></script>
        <meta name="referrer" content="strict-origin-when-cross-origin"></meta>
      </Head>
      <body>
        <Main />
        <div id="complycube-mount"></div>
        <NextScript />
      </body>
    </Html>
  );
}
