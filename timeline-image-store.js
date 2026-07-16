(() => {
  const apiRoot = "/api/timeline-images";

  async function api(path = "", options = {}) {
    const response = await fetch(`${apiRoot}${path}`, options);
    if (!response.ok) throw new Error(await response.text() || "图片管理服务不可用");
    return response.json();
  }

  async function loadAll() {
    try {
      const payload = await api();
      return payload.images || {};
    } catch {
      return window.TIMELINE_MANAGED_IMAGES || {};
    }
  }

  async function upload(key, files, replaceId = "") {
    const form = new FormData();
    form.append("key", key);
    if (replaceId) form.append("replaceId", replaceId);
    [...files].forEach((file) => form.append("files", file));
    return api("/upload", { method: "POST", body: form });
  }

  async function update(path, payload) {
    return api(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  window.timelineImageStore = {
    loadAll,
    append: (key, files) => upload(key, files),
    replaceImage: (key, imageId, file) => upload(key, [file], imageId),
    removeImage: (key, imageId) => update("/remove", { key, imageId }),
    moveImage: (key, imageId, direction) => update("/move", { key, imageId, direction }),
    deleteRecord: (key) => update("/reset", { key }),
    openAssetsFolder: () => update("/open-assets", {})
  };
})();
