(() => {
  const databaseName = "game-archive-timeline-images";
  const storeName = "card-images";
  const databaseVersion = 1;
  const objectUrls = new Set();

  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.addEventListener("success", () => resolve(request.result));
      request.addEventListener("error", () => reject(request.error));
    });
  }

  async function database() {
    const request = indexedDB.open(databaseName, databaseVersion);
    request.addEventListener("upgradeneeded", () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) db.createObjectStore(storeName, { keyPath: "key" });
    });
    return requestResult(request);
  }

  async function readRecord(key) {
    const db = await database();
    const transaction = db.transaction(storeName, "readonly");
    const result = await requestResult(transaction.objectStore(storeName).get(key));
    db.close();
    return result || null;
  }

  async function writeRecord(record) {
    const db = await database();
    const transaction = db.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).put(record);
    await new Promise((resolve, reject) => {
      transaction.addEventListener("complete", resolve);
      transaction.addEventListener("abort", () => reject(transaction.error));
      transaction.addEventListener("error", () => reject(transaction.error));
    });
    db.close();
  }

  async function deleteRecord(key) {
    const db = await database();
    const transaction = db.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).delete(key);
    await new Promise((resolve, reject) => {
      transaction.addEventListener("complete", resolve);
      transaction.addEventListener("abort", () => reject(transaction.error));
      transaction.addEventListener("error", () => reject(transaction.error));
    });
    db.close();
  }

  function sourceImage(src, name) {
    return { id: crypto.randomUUID(), kind: "source", src, name: name || "默认图片" };
  }

  function uploadedImage(file) {
    return { id: crypto.randomUUID(), kind: "upload", blob: file, name: file.name || "本地图片" };
  }

  function clearObjectUrls() {
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.clear();
  }

  async function loadAll() {
    const db = await database();
    const transaction = db.transaction(storeName, "readonly");
    const records = await requestResult(transaction.objectStore(storeName).getAll());
    db.close();
    clearObjectUrls();
    return Object.fromEntries(records.map((record) => [
      record.key,
      (record.images || []).map((image) => {
        const src = image.kind === "upload" ? URL.createObjectURL(image.blob) : image.src;
        if (image.kind === "upload") objectUrls.add(src);
        return { id: image.id, name: image.name, src };
      })
    ]));
  }

  async function replace(key, files) {
    await writeRecord({ key, images: [...files].map(uploadedImage) });
  }

  async function append(key, files, fallbackImages = []) {
    const record = await readRecord(key);
    const startingImages = record?.images?.length
      ? record.images
      : fallbackImages.map((image) => sourceImage(image.src, image.name));
    await writeRecord({ key, images: [...startingImages, ...[...files].map(uploadedImage)] });
  }

  async function removeImage(key, imageId) {
    const record = await readRecord(key);
    if (!record) return;
    const images = (record.images || []).filter((image) => image.id !== imageId);
    if (!images.length) {
      await deleteRecord(key);
      return;
    }
    await writeRecord({ key, images });
  }

  async function moveImage(key, imageId, direction) {
    const record = await readRecord(key);
    if (!record) return;
    const images = [...(record.images || [])];
    const index = images.findIndex((image) => image.id === imageId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= images.length) return;
    [images[index], images[target]] = [images[target], images[index]];
    await writeRecord({ key, images });
  }

  window.timelineImageStore = { loadAll, replace, append, removeImage, moveImage, deleteRecord };
})();
