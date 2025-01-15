import { FC, useState, useEffect } from "react";
import useSWR from "swr/immutable";
import Loading from "@/components/Loading";
import CircleCheck from "@/components/CircleCheck";
import * as API from "@/utils/api";
import { CreateComplyCubeCheck } from "@/types";
import styles from "./index.module.css";

type Props = CreateComplyCubeCheck;

type Status = "pending" | "complete";

const ComplyCubeCheckCard: FC<Props> = (props) => {
  const [checkId, setCheckId] = useState<string>();
  const [status, setStatus] = useState<Status>("pending");
  const [result, setResult] = useState<string | null>();

  const { data } = useSWR(
    checkId ? `/checks/${checkId}` : null,
    () => API.getComplyCubeCheck(checkId!),
    { refreshInterval: status === "complete" ? 0 : 3000 }
  );

  let typeText;
  let documentRow;
  let livePhotoRow;
  switch (props.type) {
    case "document_check": {
      typeText = "Document Check";
      documentRow = <p>Docuement ID: {props.documentId}</p>;

      break;
    }
    case "identity_check": {
      typeText = "Identity Check";
      documentRow = <p>Docuement ID: {props.documentId}</p>;
      livePhotoRow = <p>Live Photo ID: {props.livePhotoId}</p>;
      break;
    }
    default:
      break;
  }

  useEffect(() => {
    if (!props.type) return;

    API.createComplyCubeCheck(props)
      .then(({ data }) => {
        setCheckId(data.id);
        setStatus(data.status as Status);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!data?.data) return;

    setStatus(data.data.status as Status);
    setResult(
      (data.data.result as { outcome?: string })?.outcome ||
        JSON.stringify(data.data.result)
    );
  }, [data?.data]);

  return (
    <div className={styles.card}>
      <h3>
        Type: {typeText} <span className={styles["check-id"]}>{checkId}</span>
      </h3>
      {documentRow}
      {livePhotoRow}
      <p>Status: {status.toUpperCase()}</p>
      {result && <p>Result: {result}</p>}
      <div className={styles.status}>
        {status === "pending" && <Loading />}
        {status === "complete" && <CircleCheck />}
      </div>
    </div>
  );
};

export default ComplyCubeCheckCard;
