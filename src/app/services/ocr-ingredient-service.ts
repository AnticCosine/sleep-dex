import { Injectable } from '@angular/core';
import { createWorker, PSM } from 'tesseract.js';

export interface OcrIngredientResult {
  id: string;
  quantity: number;
}

const NAME_TO_ID: Record<string, string> = {
  'fancy eg': 'fancy_egg',
  'soft potato': 'soft_potato',
  'fancy apple': 'fancy_apple',
  'fiery herb': 'fiery_herb',
  'bean sausage': 'bean_sausage',
  'moomoo milk': 'moomoo_milk',
  'honey': 'honey',
  'pure': 'pure_oil',
  'ginger': 'warming_ginger',
  'tom': 'snoozy_tomato',
  'soybeans': 'greengrass_soybeans',
  'corn': 'greengrass_corn',
  'large leek': 'large_leek',
  'mush': 'tasty_mushroom',
  'rousing': 'rousing_coffee',
  'cacao': 'soothing_cacao',
  'pumpkin': 'plump_pumpkin',
  'avocado': 'glossy_avocado',
  'tail': 'slowpoke_tail'
};

@Injectable({
  providedIn: 'root',
})
export class OcrIngredientService {

  async processImage(file: File): Promise<OcrIngredientResult[]> {
    const worker = await createWorker('eng');

    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SPARSE_TEXT
    });

    const dataUrl = await this.fileToDataUrl(file);
    const regions = await this.splitIntoRegions(dataUrl, 4);

    let allText = '';

    for (const region of regions) {
      const preprocessed = await this.preprocessImage(region);
      const { data } = await worker.recognize(preprocessed, undefined, {debug: true});
      allText += data.text + '\n';
    }
    //const preprocessed = await this.preprocessImage(dataUrl);
    //const { data } = await worker.recognize(preprocessed);

    await worker.terminate();
    
    
    const parseIngredients = this.parseIngredients(allText);
    //console.log("OCR TEXT: ", allText);
    //console.log("parsedIngredients: ", parseIngredients)

    return parseIngredients;

  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private splitIntoRegions(dataUrl: string, columns: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const regionWidth = img.width / columns;
        const results: string[] = [];

        for (let i = 0; i < columns; i++) {
          const canvas = document.createElement('canvas');
          canvas.width = regionWidth;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d')!;

          ctx.drawImage(
            img,
            i * regionWidth,
            0,
            regionWidth,
            img.height,
            0,
            0,
            regionWidth,
            img.height
          );

          results.push(canvas.toDataURL('image/png'));

          //console.log(`Region ${i}`, canvas.toDataURL('image/png'));
        }

        resolve(results);
      };

      

      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  private preprocessImage(dataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const scale = 2.3;
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
    const contrastDelta = 50;
    const factor = (259 * (contrastDelta + 255)) / (255 * (259 - contrastDelta));
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

    const quantityRegex = /[x%](\d+)/g;
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

    

    return foundNames.map((name, i) => ({
      id: name.id,
      quantity: quantities[i]?.value ?? 0,
    }));
    
  }
  
}