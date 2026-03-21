import { Injectable } from '@angular/core';
import { createWorker } from 'tesseract.js';

export interface OcrIngredientResult {
  id: string;
  quantity: number;
}

const NAME_TO_ID: Record<string, string> = {
  'fancy egg': 'fancy_egg',
  'soft potato': 'soft_potato',
  'fancy apple': 'fancy_apple',
  'fiery herb': 'fiery_herb',
  'bean sausage': 'bean_sausage',
  'moomoo milk': 'moomoo_milk',
  'honey': 'honey',
  'pure oil': 'pure_oil',
  'warming ginger': 'warming_ginger',
  'snoozy tomato': 'snoozy_tomato',
  'soybeans': 'greengrass_soybeans',
  'corn': 'greengrass_corn',
  'large leek': 'large_leek',
  'mushroom': 'tasty_mushroom',
  'rousing coffee': 'rousing_coffee',
  'soothing cacao': 'soothing_cacao',
  'slow smokytail': 'slow_smokytail',
};

@Injectable({
  providedIn: 'root',
})
export class OcrIngredientService {

  async processImage(file: File): Promise<OcrIngredientResult[]> {
    const worker = await createWorker('eng');
    const dataUrl = await this.fileToDataUrl(file);
    const preprocessed = await this.preprocessImage(dataUrl);
    const { data } = await worker.recognize(preprocessed);

    await worker.terminate();
    
    return this.parseIngredients(data.text);

  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private preprocessImage(dataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const scale = 2;
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d')!;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.applyGreyscaleAndContrast(imageData);
        ctx.putImageData(imageData, 0, 0);

        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  private applyGreyscaleAndContrast(imageData: ImageData): void {
    const d = imageData.data;

    const contrast = 1.6;
    const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));

    for (let i = 0; i < d.length; i += 4) {
      const grey = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      const adjusted = Math.min(255, Math.max(0, factor * (grey - 128) + 128));
      d[i] = d[i + 1] = d[i + 2] = adjusted;
    }
  }


  private parseIngredients(text: string): OcrIngredientResult[] {
    const ingredientKeys = Object.keys(NAME_TO_ID).sort((a, b) => b.length - a.length);

    const normalized = text
      .toLowerCase()
      .replace(/[""''=)([\]|]/g, '')
      .replace(/[\s]+/g, ' ')
      .trim();

    const quantityRegex = /x(\d+)/g;
    const quantities: { value: number; index: number }[] = [];
    let match: RegExpExecArray | null;
    while ((match = quantityRegex.exec(normalized)) !== null) {
      quantities.push({ value: parseInt(match[1], 10), index: match.index });
    }

    const foundNames: { id: string; index: number }[] = [];
    let searchText = normalized;
    for (const key of ingredientKeys) {
      const keyIndex = searchText.indexOf(key);
      if (keyIndex !== -1) {
        foundNames.push({ id: NAME_TO_ID[key], index: keyIndex });
        
        searchText = searchText.slice(0, keyIndex) 
          + ' '.repeat(key.length) 
          + searchText.slice(keyIndex + key.length);
      }
    }

    quantities.sort((a, b) => a.index - b.index);
    foundNames.sort((a, b) => a.index - b.index);

    // reversing the order 
    quantities.sort((a, b) => a.index - b.index); 
    foundNames.sort((a, b) => a.index - b.index);

    return foundNames.map((name, i) => ({
      id: name.id,
      quantity: quantities[i]?.value ?? 0,
    }));
    
  }
  
}