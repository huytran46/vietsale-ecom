import { MyFile } from "models/MyFile";
import React from "react";

type FileContext = {
  setSelFileIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedFileIds: string[];
  setFileId: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedFileId?: string;
  handleSelectFileId: (fid: string) => void;
  setFiles: React.Dispatch<React.SetStateAction<MyFile[]>>;
  selectedFiles: MyFile[];
  selectedMyFiles: (MyFile | undefined)[];
  selectedMyFile: MyFile | undefined;
};

const FileCtx = React.createContext({} as FileContext);

export const FileProvider: React.FC = ({ children }) => {
  const [selectedFiles, setFiles] = React.useState<MyFile[]>([]);
  const [selectedFileId, setFileId] = React.useState<string>();
  const [selectedFileIds, setSelFileIds] = React.useState<string[]>([]);

  const selectedMyFiles = React.useMemo(
    () =>
      selectedFileIds
        .map((fid) => selectedFiles.find((f) => f.id === fid))
        .filter((_) => Boolean(_)),
    [selectedFileIds, selectedFiles]
  );

  const selectedMyFile = React.useMemo(
    () => selectedFiles.find((f) => f.id === selectedFileId),
    [selectedFileId, selectedFiles]
  );

  const handleSelectFileId = React.useCallback(
    (fid: string) => {
      const idx = selectedFileIds.indexOf(fid);
      const next = [...selectedFileIds];
      if (idx < 0) {
        next.push(fid);
      } else {
        next.splice(idx, 1);
      }
      setSelFileIds(next);
    },
    [selectedFileIds]
  );

  return (
    <FileCtx.Provider
      value={{
        selectedMyFile,
        selectedMyFiles,
        selectedFiles,
        setFiles,
        selectedFileIds,
        setSelFileIds,
        selectedFileId,
        setFileId,
        handleSelectFileId,
      }}
    >
      {children}
    </FileCtx.Provider>
  );
};

export const useFileCtx = () => React.useContext(FileCtx);
