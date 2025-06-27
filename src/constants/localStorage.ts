import { storageKey } from "../enums/localStorage";

export const getInstagramUser = (): string | null => {
  return localStorage.getItem(storageKey.InstagramUser);
};

export const setInstagramUser = (value: string): void => {
  localStorage.setItem(storageKey.InstagramUser, value);
};

export const removeInstagramUser = (): void => {
  localStorage.removeItem(storageKey.InstagramUser);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(storageKey.AccessToken);
};

export const setAccessToken = (value: string): void => {
  localStorage.setItem(storageKey.AccessToken, value);
};

export const removeAccessToken = (): void => {
  localStorage.removeItem(storageKey.AccessToken);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(storageKey.RefreshToken);
};

export const setRefreshToken = (value: string): void => {
  localStorage.setItem(storageKey.RefreshToken, value);
};

export const removeRefreshToken = (): void => {
  localStorage.removeItem(storageKey.RefreshToken);
};

export const getDeviceId = (): string | null => {
  return localStorage.getItem(storageKey.DeviceId);
};

export const setDeviceId = (value: string): void => {
  localStorage.setItem(storageKey.DeviceId, value);
};

export const removeDeviceId = (): void => {
  localStorage.removeItem(storageKey.DeviceId);
};

export const getSelectedChatId = (): string | null => {
  return localStorage.getItem(storageKey.SelectedChatId);
};

export const setSelectedChatId = (value: string): void => {
  localStorage.setItem(storageKey.SelectedChatId, value);
};

export const removeSelectedChatId = (): void => {
  localStorage.removeItem(storageKey.SelectedChatId);
};
