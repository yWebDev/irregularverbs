import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { instantiateStreaming } from '@assemblyscript/loader';
import { levenshteinDistance } from 'src/app/utils/functional';

type DistanceFn = (a: string, b: string) => number;

interface LevenshteinWasmExports {
  memory: WebAssembly.Memory;
  __new: (size: number, classId: number) => number;
  levenshteinUtf8: (
    aPtr: number,
    aLen: number,
    bPtr: number,
    bLen: number,
  ) => number;
}

@Injectable({
  providedIn: 'root',
})
export class LevenshteinWasmService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private wasmDistance: DistanceFn | null = null;
  private loadPromise: Promise<DistanceFn> | null = null;
  private readonly textEncoder = new TextEncoder();

  /**
   * UTF-8 byte–based Levenshtein in WASM (AssemblyScript); pure TS fallback on the server
   * or if loading fails.
   */
  async getDistanceFn(): Promise<DistanceFn> {
    if (!isPlatformBrowser(this.platformId)) {
      return levenshteinDistance;
    }
    if (this.wasmDistance) return this.wasmDistance;
    if (!this.loadPromise) {
      this.loadPromise = this.loadWasm().catch(() => levenshteinDistance);
    }
    return this.loadPromise;
  }

  private async loadWasm(): Promise<DistanceFn> {
    // Resolve against <base href> so ng serve and production serve /assets/... instead of
    // import.meta.url (dev bundler can turn that into @fs/... and wrong folders).
    const wasmUrl = new URL(
      'assets/wasm/levenshtein.wasm',
      this.document.baseURI,
    ).href;
    const { exports } = await instantiateStreaming(fetch(wasmUrl));
    const ex = exports as unknown as LevenshteinWasmExports;

    this.wasmDistance = (a: string, b: string): number => {
      const ab = this.textEncoder.encode(a);
      const bb = this.textEncoder.encode(b);
      if (ab.length > 256 || bb.length > 256) {
        return levenshteinDistance(a, b);
      }
      const aPtr = ex.__new(ab.length, 0) >>> 0;
      const bPtr = ex.__new(bb.length, 0) >>> 0;
      const mem = new Uint8Array(ex.memory.buffer);
      mem.set(ab, aPtr);
      mem.set(bb, bPtr);
      return ex.levenshteinUtf8(aPtr, ab.length, bPtr, bb.length);
    };
    return this.wasmDistance;
  }
}
