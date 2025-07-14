import JSZip from "jszip";
import { saveAs } from "file-saver";

export interface IFileItemDownload {
  name: string;
  url: string;
}

export const downloadZipFromUrls = async (files: IFileItemDownload[]) => {
  const zip = new JSZip();

  for (const file of files) {
    try {
      const response = await fetch(file.url);

      if (!response.ok) throw new Error(`Erro ao baixar ${file.name}`);

      const blob = await response.blob();

      zip.file(file.name, blob);
    } catch (error) {
      console.error("Erro ao processar arquivo:", file.name, error);
    }
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });

  saveAs(zipBlob, `${files.length} arquivos.zip`);
};
