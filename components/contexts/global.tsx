"use client";
import type { ReactNode, Context } from "react";
import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import type { UploadResponse } from "pinata";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { createContext, useCallback, useEffect, useReducer } from "react";

interface CustomComponentProps {
   children: ReactNode;
}

type StateFileFunction = (prevState: UploadResponse[]) => UploadResponse[];

enum Action {
   SET_FILES = 0x01,
   ADD_FILE,
   REMOVE_FILE,
   SET_SELECTED_FILE
}

interface CustomContextProps {
   files: UploadResponse[];
   setFiles(files: UploadResponse[] | StateFileFunction): void;
   addFile(files: UploadResponse): void;
   removeFile(file: UploadResponse): void;
   selectedFile: UploadResponse;
   setSelectedFile(file: UploadResponse): void;
   fileUploadDialog: UseDisclosureReturn;
   fileDetailsDialog: UseDisclosureReturn;
}

interface CustomDispatchProps {
   action: Action;
   value: UploadResponse | UploadResponse[] | StateFileFunction;
}

let _initialStates: CustomContextProps = {
   files: [],
   setFiles: () => {},
   addFile: () => {},
   removeFile: () => {},
   selectedFile: {
      cid: "",
      created_at: new Date().toISOString(),
      group_id: "",
      id: "",
      mime_type: "",
      name: "",
      number_of_files: 0,
      size: 0,
      user_id: ""
   },
   setSelectedFile: () => {},
   fileUploadDialog: {} as UseDisclosureReturn,
   fileDetailsDialog: {} as UseDisclosureReturn
};

function statesReducer(
   states: CustomContextProps,
   data: CustomDispatchProps
): CustomContextProps {
   switch (data.action) {
      case Action.SET_FILES: {
         let proposedState: UploadResponse[] = data.value as UploadResponse[];

         if (typeof data.value === "function") {
            proposedState = data.value(states.files);
         }

         localStorage.setItem("files", JSON.stringify(proposedState));

         return {
            ...states,
            files: proposedState
         };
      }
      case Action.ADD_FILE: {
         if (
            states.files.find(
               (file: UploadResponse) =>
                  file.cid === (data.value as UploadResponse).cid
            )
         ) {
            return states;
         }

         const proposedState: UploadResponse[] = [
            ...states.files,
            data.value as UploadResponse
         ];

         localStorage.setItem("files", JSON.stringify(proposedState));

         return {
            ...states,
            files: proposedState
         };
      }
      case Action.REMOVE_FILE: {
         const proposedState: UploadResponse[] = states.files.filter(
            (file: UploadResponse) =>
               file.id !== (data.value as UploadResponse).id
         );

         localStorage.setItem("files", JSON.stringify(proposedState));

         return {
            ...states,
            files: proposedState
         };
      }
      case Action.SET_SELECTED_FILE:
         return {
            ...states,
            selectedFile: data.value as UploadResponse
         };
      default:
         return states;
   }
}

export const GlobalContext: Context<CustomContextProps> =
   createContext<CustomContextProps>(_initialStates);

export function GlobalProvider({
   children
}: Readonly<CustomComponentProps>): ReactNode {
   const [{ files, selectedFile }, dispatch] = useReducer(
      statesReducer,
      _initialStates
   );
   const fileUploadDialog = useDisclosure({ id: "file_upload" });
   const fileDetailsDialog = useDisclosure({ id: "file_details" });
   const setFiles = useCallback(
      (files: UploadResponse[] | StateFileFunction) =>
         dispatch({ action: Action.SET_FILES, value: files }),
      []
   );
   const addFile = useCallback(
      (file: UploadResponse) =>
         dispatch({ action: Action.ADD_FILE, value: file }),
      []
   );
   const removeFile = useCallback(
      (file: UploadResponse) =>
         dispatch({ action: Action.REMOVE_FILE, value: file }),
      []
   );
   const setSelectedFile = useCallback(
      (file: UploadResponse) =>
         dispatch({ action: Action.SET_SELECTED_FILE, value: file }),
      []
   );

   _initialStates = {
      files,
      setFiles,
      addFile,
      removeFile,
      selectedFile,
      setSelectedFile,
      fileUploadDialog,
      fileDetailsDialog
   };

   useEffect(() => {
      [{ key: "files", action: Action.SET_FILES }].forEach((entry) => {
         const storageEntry: string | null = localStorage.getItem(entry.key);

         if (storageEntry) {
            dispatch({
               action: entry.action,
               value: JSON.parse(storageEntry)
            });
         }
      });
   }, []);

   return (
      <GlobalContext.Provider value={_initialStates}>
         {children}
      </GlobalContext.Provider>
   );
}
