import diskusage from "diskusage";

export async function verifyStorageSpace(diskPath: string): Promise<{ total: number; free: number } | null> {
  return new Promise((resolve, reject) => {

    diskusage.check(diskPath, (err, info) => {
      if (err) {
        console.error("Erro ao obter informações do disco:", err);
        reject(err);
        return;
      }

      if (info) {
        const total = parseFloat((info.total / 1e9).toFixed(2));
        const free = parseFloat((info.free / 1e9).toFixed(2));
        resolve({ total, free });
      } else {
        console.error("Erro: Informações do disco não estão disponíveis.");
        resolve(null);
      }
    });
  });
}