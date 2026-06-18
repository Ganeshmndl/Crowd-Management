import * as faceapi from "face-api.js";

let modelsLoaded = false;

export const loadFaceModels = async () => {
  if (modelsLoaded) return;
  
  const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model";
  
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);
  
  modelsLoaded = true;
};

export const generateFaceDescriptor = async (imageFile) => {
  await loadFaceModels();
  
  const img = await faceapi.bufferToImage(imageFile);
  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();
    
  if (!detection) return null;
  
  return Array.from(detection.descriptor);
};

export const compareFaceDescriptors = (desc1, desc2) => {
  if (!desc1 || !desc2) return null;
  
  const euclideanDistance = faceapi.euclideanDistance(desc1, desc2);
  const similarity = Math.max(0, Math.min(100, Math.round((1 - euclideanDistance) * 100)));
  
  return similarity;
};
