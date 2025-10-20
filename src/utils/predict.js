import * as tf from '@tensorflow/tfjs';

// Paths for assets (served by Vite dev server)
const MODEL_URL = '/src/assets/Model/model.json';
const LABELS_URL = '/src/assets/Model/labels.json';
const SCALER_URL = '/src/assets/Model/scaler.json';

let graphModelPromise;
let labelsPromise;
let scalerPromise;

export async function loadArtifactsGraph() {
  if (!graphModelPromise) graphModelPromise = tf.loadGraphModel(MODEL_URL);
  if (!labelsPromise) labelsPromise = fetch(LABELS_URL).then(r => r.json());
  if (!scalerPromise) scalerPromise = fetch(SCALER_URL).then(r => r.json());
  const [model, labels, scaler] = await Promise.all([graphModelPromise, labelsPromise, scalerPromise]);
  return { model, labels, scaler };
}

function normalize(val, mean, std) {
  return (val - mean) / (std || 1);
}

export function timeFeatures(date = new Date()) {
  const d = new Date(date);
  const hour = d.getHours();
  const dow = d.getDay();
  const month = d.getMonth() + 1;
  return [
    hour, dow, month,
    Math.sin((2 * Math.PI * hour) / 24),
    Math.cos((2 * Math.PI * hour) / 24),
    Math.sin((2 * Math.PI * dow) / 7),
    Math.cos((2 * Math.PI * dow) / 7),
    Math.sin((2 * Math.PI * month) / 12),
    Math.cos((2 * Math.PI * month) / 12),
  ];
}

export function extraFeatures() {
  // No history in browser; keep zeros like script example
  return [0, 0, 0, 0];
}

// Build 18-length vector: [values(5), time(9), extra(4)] and standardize using scaler
export function preprocessTSVector(values, date, scaler) {
  const feats = [...values, ...timeFeatures(date), ...extraFeatures()];
  const norm = scaler?.mean?.length === feats.length
    ? feats.map((v, i) => normalize(v, scaler.mean[i], scaler.std[i]))
    : feats;
  // Repeat for 24 time steps -> [1,24,18]
  const seq = Array(24).fill(norm);
  return tf.tensor([seq]);
}

export async function tensorFromDataURL(dataUrl) {
  const img = new Image();
  img.src = dataUrl;
  await new Promise((res) => { img.onload = res; });
  return tf.tidy(() => tf.browser.fromPixels(img).resizeNearestNeighbor([224, 224]).toFloat().div(255).expandDims(0));
}

export async function tensorFromFile(file) {
  const reader = new FileReader();
  const dataUrl = await new Promise((res) => { reader.onload = () => res(reader.result); reader.readAsDataURL(file); });
  return tensorFromDataURL(dataUrl);
}

export function buildOWMValues(weather) {
  const temp = weather?.main?.temp ?? 0; // °C
  const humidity = weather?.main?.humidity ?? 0; // %
  const rain = weather?.rain?.['1h'] ?? weather?.rain?.['3h'] ?? 0; // mm
  const wind = weather?.wind?.speed ?? 0; // m/s
  const clouds = weather?.clouds?.all ?? 0; // %
  return [temp, humidity, rain, wind, clouds];
}

export async function predictFromModel({ weather, date = new Date(), dataUrl, file }) {
  const { model, labels, scaler } = await loadArtifactsGraph();
  const values = buildOWMValues(weather);
  const ts = preprocessTSVector(values, date, scaler);
  const img = file ? await tensorFromFile(file) : await tensorFromDataURL(dataUrl);
  const out = await model.executeAsync({ img_input: img, ts_input1: ts, ts_input2: ts });
  const probsTensor = Array.isArray(out) ? out[0] : out;
  const probs = await probsTensor.data();
  const arr = Array.from(probs);
  let maxIdx = 0; let maxVal = -Infinity;
  for (let i = 0; i < arr.length; i++) { if (arr[i] > maxVal) { maxVal = arr[i]; maxIdx = i; } }
  const label = labels?.[String(maxIdx)] ?? String(maxIdx);
  img.dispose(); ts.dispose(); probsTensor.dispose();
  return { index: maxIdx, label, confidence: maxVal * 100, probs: arr, labels };
}

// Legacy exports kept for compatibility (no-op stubs for old usage)
export function buildFeatures() { return []; }
export async function predictWeatherClass() { return { index: 0, label: 'Cerah', confidence: 0, probs: [1,0,0] }; }
