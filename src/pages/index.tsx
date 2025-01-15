import { useState, useCallback, useEffect, useMemo } from "react";
import Head from "next/head";
import GitHubIcon from "@/components/GitHubIcon";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import ComplyCubeCheckCardList from "@/components/ComplyCubeCheckCardList";
import { Geist, Geist_Mono } from "next/font/google";
import { Client } from "@complycube/api";
import * as API from "@/utils/api";
import {
  Token,
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
  const [client, setClient] = useState<Client>();
  const [token, setToken] = useState<Token>();
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

  const onSubmit = useCallback(async (info: PersonalInfo) => {
    try {
      const { data } = await API.createComplyCubeClient(info);
      setClient(data.client);
      API.setComplyCubeClientIdHeader(data.client.id);
    } catch (error) {
      console.error("failed to create a complycube client", error);
    }
  }, []);

  const createComplyCubeToken = useCallback(async (id: string) => {
    try {
      const { data } = await API.createComplyCubeToken(id);
      setToken(data.token);
    } catch (error) {
      console.error("failed to create a token", error);
    }
  }, []);

  useEffect(() => {
    if (!client?.id) return;

    createComplyCubeToken(client.id);
  }, [client?.id]);

  useEffect(() => {
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

    return () => complycube.unmount();
  }, [token]);

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
          {!showCheckList && <PersonalInfoForm onSubmit={onSubmit} />}
          {showCheckList && <ComplyCubeCheckCardList data={checkList} />}
        </main>
      </div>
    </>
  );
}
