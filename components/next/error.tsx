import Head from "next/head";
import React from "react";

const statusCodes: { [code: number]: string } = {
  400: "Bad Request",
  404: "This page could not be found",
  405: "Method Not Allowed",
  500: "Internal Server Error",
};

export type ErrorProps = {
  statusCode: number;
  hostname?: string;
  title?: string;
  withDarkMode?: boolean;
};

const styles: Record<string, React.CSSProperties> = {
  error: {
    // https://github.com/sindresorhus/modern-normalize/blob/main/modern-normalize.css#L38-L52
    fontFamily:
      'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  desc: {
    lineHeight: "48px",
  },
  h1: {
    display: "inline-block",
    margin: "0 20px 0 0",
    paddingRight: 23,
    fontSize: 24,
    fontWeight: 500,
    verticalAlign: "top",
  },
  h2: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "28px",
  },
  wrap: {
    display: "inline-block",
  },
};

/**
 * `Error` component used for handling errors.
 */
export function Error(props: ErrorProps) {
  const { statusCode } = props;
  const title =
    props.title ||
    statusCodes[statusCode] ||
    "An unexpected error has occurred";

  return (
    <div style={styles.error}>
      <Head>
        <title>
          {statusCode
            ? `${statusCode}: ${title}`
            : "Application error: a client-side exception has occurred"}
        </title>
      </Head>
      <div style={styles.desc}>
        {statusCode ? (
          <h1 className="next-error-h1" style={styles.h1}>
            {statusCode}
          </h1>
        ) : null}
        <div style={styles.wrap}>
          <h2 style={styles.h2}>
            {props.title || statusCode ? (
              title
            ) : (
              <>
                Application error: a client-side exception has occurred{" "}
                {Boolean(props.hostname) && <>while loading {props.hostname}</>}{" "}
                (see the browser console for more information)
              </>
            )}
            .
          </h2>
        </div>
      </div>
    </div>
  );
}
