import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Head from "next/head";
import GitHubIcon from "@/components/GitHubIcon";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import ComplyCubeCheckCardList from "@/components/ComplyCubeCheckCardList";
import Loading from "@/components/Loading";
import { Geist, Geist_Mono } from "next/font/google";
import { Client } from "@complycube/api";
import * as API from "@/utils/api";
import {
  PersonalInfo,
  ComplyCubeCompleteEvent,
  ComplyCubeDocumentCapture,
  ComplyCubeFaceCapture,
  ComplyCubeErrorEvent,
  CreateComplyCubeCheck,
} from "@/types";
import styles from "./index.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const loadingRef = useRef(false);
  const complycubeRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<Client>();
  const [documentCapture, setDocumentCapture] =
    useState<ComplyCubeDocumentCapture>();
  const [faceCapture, setFaceCapture] = useState<ComplyCubeFaceCapture>();

  const checkList = useMemo(() => {
    const res: CreateComplyCubeCheck[] = [];
    if (documentCapture) {
      res.push({
        type: "document_check",
        documentId: documentCapture.documentId,
      });
    }
    if (documentCapture && faceCapture) {
      res.push({
        type: "identity_check",
        documentId: documentCapture.documentId,
        livePhotoId: faceCapture.livePhotoId,
      });
    }
    return res;
  }, [documentCapture, faceCapture]);

  const showCheckList = !!checkList.length;

  const createComplyCubeToken = useCallback(async (id: string) => {
    const { data } = await API.createComplyCubeToken(id);
    return data.token;
  }, []);

  const onSubmit = useCallback(async (info: PersonalInfo) => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      const { data } = await API.createComplyCubeClient(info);
      setClient(data.client);
      API.setComplyCubeClientIdHeader(data.client.id);
      const token = await createComplyCubeToken(data.client.id);

      loadingRef.current = false;
      setLoading(false);

      if (!token) return;

      if (!ComplyCube) {
        return window.alert(
          "ComplyCube initialization has failed, please refresh the page"
        );
      }

      const complycube = ComplyCube.mount({
        token,
        stages: ["intro", "documentCapture", "faceCapture", "completion"],
        onComplete(data: ComplyCubeCompleteEvent) {
          setDocumentCapture(data.documentCapture);
          setFaceCapture(data.faceCapture);
          setTimeout(
            () => complycube.updateSettings({ isModalOpen: false }),
            2000
          );
        },
        onModalClose() {
          complycube.updateSettings({ isModalOpen: false });
        },
        onError({ type, message }: ComplyCubeErrorEvent) {
          if (type === "token_expired" && client) {
            createComplyCubeToken(client.id);
          } else {
            console.error(message);
          }
        },
      });

      complycubeRef.current = complycube;
    } catch (error) {
      console.error("failed to initialize an onboarding flow.", error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => () => complycubeRef.current?.unmount(), []);

  return (
    <>
      <Head>
        <title>Next.js KYC Web Application with ComplyCube Integration</title>
        <meta
          name="description"
          content="A Next.js web application designed for seamless identity verification and compliance management, integrating with ComplyCube's powerful KYC and AML solutions to ensure secure and efficient onboarding of users."
        />
      </Head>
      <div
        className={`${styles.page} 
        ${geistSans.variable} 
        ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <div className={styles.github}>
            <GitHubIcon />
          </div>
          <h1 className={styles.title}>Customer Onboarding</h1>
          {loading && (
            <div className={styles.loading}>
              <Loading />
            </div>
          )}
          {!showCheckList && <PersonalInfoForm onSubmit={onSubmit} />}
          {showCheckList && <ComplyCubeCheckCardList data={checkList} />}
        </main>
      </div>
    </>
  );
}
