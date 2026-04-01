import { FileText, FileImage, FileSpreadsheet, FileArchive, File as FileIcon } from "lucide-react";

export const getFileIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case "pdf":
      return <FileText className="w-5 h-5 text-red-500" />;

    case "image":
    case "jpg":
    case "jpeg":
    case "png":
      return <FileImage className="w-5 h-5 text-blue-500" />;

    case "excel":
    case "xls":
    case "xlsx":
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />;

    case "zip":
    case "rar":
      return <FileArchive className="w-5 h-5 text-yellow-600" />;

    default:
      return <FileIcon className="w-5 h-5 text-gray-500" />;
  }
};