import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function uploadPdf(file: File, isTwoColumn: boolean) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("is_two_column", String(isTwoColumn));

  const response = await axios.post(`${API_BASE_URL}/extract-keywords/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

