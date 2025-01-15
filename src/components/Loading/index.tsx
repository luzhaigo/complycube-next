import styles from "./index.module.css";

const Loading = () => {
  return (
    <div className={styles.loading} role="status">
      <div className={styles["loading__pulse"]}></div>
    </div>
  );
};

export default Loading;
