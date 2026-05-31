import { CATEGORY_PREFIXES } from "@/config/pricing";

const normalizeCategoryPrefixKey = value => {
  const normalized = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (normalized === "EXTREME" || normalized === "OPEN_CATEGORY") {
    return "OPEN";
  }

  if (normalized === "LADIES_CATEGORY") {
    return "LADIES";
  }

  return normalized;
};

const cleanStickerNumber = value =>
  String(value || "")
    .trim()
    .replace(/^#/, "")
    .replace(/\s+/g, "")
    .toUpperCase();

export const getStickerPrefixForCategory = categoryKey =>
  CATEGORY_PREFIXES[normalizeCategoryPrefixKey(categoryKey)] || "";

export const formatStickerNumber = (categoryKey, stickerNumber) => {
  const rawSticker = cleanStickerNumber(stickerNumber);

  if (!rawSticker || /^[A-Z]+/.test(rawSticker)) {
    return rawSticker;
  }

  return `${getStickerPrefixForCategory(categoryKey)}${rawSticker}`;
};

export const normalizeStickerIdentity = (categoryKey, stickerNumber) => {
  const rawSticker = cleanStickerNumber(stickerNumber);
  const prefix = getStickerPrefixForCategory(categoryKey);

  return prefix && rawSticker.startsWith(prefix)
    ? rawSticker.slice(prefix.length)
    : rawSticker;
};
