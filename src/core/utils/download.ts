import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

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

interface HeadColumn {
  name: string;
  value: string;
  order?: boolean;
  width?: number;
}

export function generateCSVandExcel(
  thead: HeadColumn[],
  data: Record<string, any>[],
  fileName: string = "export"
) {
  const visibleColumns = thead.filter((col) => col.value); // remove colunas com value vazio
  const headers = visibleColumns.map((col) => col.name);

  const rows = data.map((row) =>
    visibleColumns.map((col) => {
      const value = row[col.value];

      if (value instanceof Date) return value.toISOString();
      if (value === null || value === undefined) return "";
      return value.toString();
    })
  );

  // ---------- CSV ----------
  const csv = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");

  // ---------- EXCEL ----------
  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Planilha");

  const excelBlob = XLSX.write(workbook, {
    type: "binary",
    bookType: "xlsx",
  });

  // helper para salvar em blob (caso use em frontend)
  const toBlob = () => {
    const buffer = new ArrayBuffer(excelBlob.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < excelBlob.length; i++) {
      view[i] = excelBlob.charCodeAt(i) & 0xff;
    }
    return new Blob([buffer], { type: "application/octet-stream" });
  };

  return {
    csv,
    downloadCSV: () => {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `${fileName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    downloadExcel: () => {
      const blob = toBlob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `${fileName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  };
}
