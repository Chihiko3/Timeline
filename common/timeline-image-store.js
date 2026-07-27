(() => {
  const apiRoot = "/api/timeline-images";

  function fallbackImages() {
    return {
      ...(window.HARDWARE_TIMELINE_IMAGES || {}),
      ...(window.POKEMON_TIMELINE_IMAGES || {}),
      ...(window.FINAL_FANTASY_TIMELINE_IMAGES || {}),
      ...(window.DRAGON_QUEST_TIMELINE_IMAGES || {}),
      ...(window.LIKE_A_DRAGON_TIMELINE_IMAGES || {}),
      ...(window.XENOBLADE_TIMELINE_IMAGES || {}),
      ...(window.SPIKE_SERIES_TIMELINE_IMAGES || {})
    };
  }

  async function api(path = "", options = {}) {
    const response = await fetch(`${apiRoot}${path}`, options);
    if (!response.ok) throw new Error(await response.text() || "图片管理服务不可用");
    return response.json();
  }

  async function loadAll() {
    try {
      const payload = await api();
      return {
        ...fallbackImages(),
        ...(payload.images || {})
      };
    } catch {
      return fallbackImages();
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
    openAssetsFolder: () => update("/open-assets", {})
  };
})();
