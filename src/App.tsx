import type { Component } from 'solid-js';
import * as avif from '@jsquash/avif';
import * as jpeg from '@jsquash/jpeg';
import * as png from '@jsquash/png';
import * as webp from '@jsquash/webp';

import logo from './logo.svg';
import styles from './App.module.css';

async function decode (sourceType: string, fileBuffer: ArrayBuffer) {
  switch (sourceType) {
    case 'avif':
      return await avif.decode(fileBuffer);
    case 'jpeg':
      return await jpeg.decode(fileBuffer);
    case 'png':
      return await png.decode(fileBuffer);
    case 'webp':
      return await webp.decode(fileBuffer);
    default:
      throw new Error(`Unknown source type: ${sourceType}`);
  }
}

async function encode (outputType: string, imageData: ImageData) {
  switch (outputType) {
    case 'avif':
      return await avif.encode(imageData);
    case 'jpeg':
      return await jpeg.encode(imageData);
    case 'png':
      return await png.encode(imageData);
    case 'webp':
      return await webp.encode(imageData);
    default:
      throw new Error(`Unknown output type: ${outputType}`);
  }
}

async function convert (sourceType: string, outputType: string, fileBuffer: ArrayBuffer) {
  const imageData = await decode(sourceType, fileBuffer);
  return encode(outputType, imageData);
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

async function showOutput (imageBuffer: ArrayBuffer, outputType: string) {
  const preview = document.querySelector('#preview');
  const imageBlob = new Blob([imageBuffer], { type: `image/${outputType}` });
  const base64String = await blobToBase64(imageBlob);
  const previewImg = document.createElement('img');
  previewImg.src = base64String;
  preview!.innerHTML = '';
  preview!.appendChild(previewImg);
}


const App: Component = () => {
  return (
    <div class={styles.App}>
      <input type="file" oninput={async (evt) => {
        evt.preventDefault();
        const target = evt.target as HTMLInputElement;
        const file = target.files?.[0]
        if (!file) {
          console.log('no file');
          return
        }
        const sourceType = file.type.replace('image/', '');
        const outputType = 'webp';
        const fileBuffer = await file.arrayBuffer();
        console.log('file buffer', fileBuffer);
        const imageBuffer = await convert(sourceType, outputType, fileBuffer);
        console.log('imageBuffer', imageBuffer);
        showOutput(imageBuffer, outputType);
      }}/>
      <div id="preview"></div>
    </div>
  );
};

export default App;
