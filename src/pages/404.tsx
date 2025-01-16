import Head from "next/head";
import Link from "next/link";
import HomeIcon from "@/components/HomeIcon";
import styles from "./404.module.css";

const NotFound = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>404 Not Found</title>
        <meta name="description" content="404 Not Found" />
      </Head>
      <div className={styles.content}>
        <h1 className={styles["error-h1"]}>404</h1>
        <h2 className={styles.message}>This page could not be found.</h2>
      </div>
      <Link href="/">
        <HomeIcon className={styles.home} />
      </Link>
    </div>
  );
};

export default NotFound;
