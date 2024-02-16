import api from '../../utils/api.js';

export async function getNodeHeight() {
  const res = await api.getHeight();

  return res.data || res;
}

export async function getNodeVersion() {
  const res = await api.getNodeVersion();

  return res.data || res;
}
