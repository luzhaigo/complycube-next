import { FC } from "react";
import ComplyCubeCheckCard from "@/components/ComplyCubeCheckCard";
import { CreateComplyCubeCheck } from "@/types";
import styles from "./index.module.css";

type Props = {
  data?: CreateComplyCubeCheck[];
};

const ComplyCubeCheckCardList: FC<Props> = ({ data = [] }) => {
  return (
    <ul className={styles.list}>
      {data.map((item) => (
        <li key={item.type}>
          <ComplyCubeCheckCard {...item} />
        </li>
      ))}
    </ul>
  );
};

export default ComplyCubeCheckCardList;
