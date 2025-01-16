import Head from "next/head";
import Link from "next/link";
import HomeIcon from "@/components/HomeIcon";
import styles from "./404.module.css";

const InternalServerErrorPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>500 Internal Server Error"</title>
        <meta name="description" content="500 Internal Server Error" />
      </Head>
      <div className={styles.content}>
        <h1 className={styles["error-h1"]}>500</h1>
        <h2 className={styles.message}>Internal Server Error.</h2>
      </div>
      <Link href="/">
        <HomeIcon className={styles.home} />
      </Link>
    </div>
  );
};

export default InternalServerErrorPage;
