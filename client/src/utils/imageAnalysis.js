/**
 * Advanced Paranormal Optical & Pixel Analysis Engine — v3.0
 *
 * Scoring rules (enforced on client, echoed by server):
 *   ≥ 6  (i.e. 6–10) → ONLY for images that are GENUINELY scary / ghost-like
 *   ≤ 5              → Normal photos (daylight, people, cars, food, pets…)
 *
 * Detection strategy uses MULTI-FEATURE SCORING so a single trait
 * (e.g. "dark background") is never enough to make a normal photo scary.
 */
export async function analyzeImageContent(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        // ── 1. Draw to an analysis canvas ──────────────────────────────
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const W = 160;
        const H = 160;
        canvas.width = W;
        canvas.height = H;
        ctx.drawImage(img, 0, 0, W, H);

        const imgData = ctx.getImageData(0, 0, W, H).data;
        const pixelCount = (imgData.length / 4);

        // ── 2. Per-pixel statistics ─────────────────────────────────────
        let rTotal = 0, gTotal = 0, bTotal = 0;
        let lumTotal = 0;
        let darkPx = 0;    // lum < 55
        let midDarkPx = 0; // lum 55-100
        let brightPx = 0;  // lum > 195
        let satTotal = 0;
        let hueVarianceSum = 0;

        // Flesh-tone detection (hue ≈ 5–35°, saturation moderate, mid-bright)
        let fleshTonePx = 0;

        // Luminance grid for hotspot detection
        const lumGrid = new Float32Array(W * H);

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];

          rTotal += r;
          gTotal += g;
          bTotal += b;

          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          const pi = i / 4;
          lumGrid[pi] = lum;
          lumTotal += lum;

          if (lum < 55)        darkPx++;
          else if (lum < 100)  midDarkPx++;
          if (lum > 195)       brightPx++;

          // HSV saturation
          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          const delta = maxC - minC;
          const sat = maxC === 0 ? 0 : delta / maxC;
          satTotal += sat;

          // Approximate hue (0-360)
          let hue = 0;
          if (delta > 0) {
            if (maxC === r)      hue = 60 * (((g - b) / delta) % 6);
            else if (maxC === g) hue = 60 * ((b - r) / delta + 2);
            else                 hue = 60 * ((r - g) / delta + 4);
            if (hue < 0) hue += 360;
          }
          hueVarianceSum += hue;

          // Flesh-tone: hue 0-40 OR 340-360, sat 0.15-0.65, mid-bright lum
          if (
            ((hue >= 0 && hue <= 40) || hue >= 340) &&
            sat >= 0.15 && sat <= 0.68 &&
            lum >= 70 && lum <= 215
          ) {
            fleshTonePx++;
          }
        }

        const avgR   = rTotal / pixelCount;
        const avgG   = gTotal / pixelCount;
        const avgB   = bTotal / pixelCount;
        const avgLum = lumTotal / pixelCount;
        const avgSat = satTotal / pixelCount;
        const darkRatio   = darkPx / pixelCount;
        const midDarkRatio = midDarkPx / pixelCount;
        const brightRatio = brightPx / pixelCount;
        const fleshRatio  = fleshTonePx / pixelCount;

        // ── 3. Colour variety (count distinct hue buckets) ─────────────
        // Slice hue into 36 buckets of 10°, count how many have >0.5% of pixels
        const hueBuckets = new Uint32Array(36);
        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i], g = imgData[i+1], b = imgData[i+2];
          const maxC = Math.max(r,g,b), minC = Math.min(r,g,b), delta = maxC - minC;
          if (delta < 20) continue; // near-greyscale pixel — skip
          let hue = 0;
          if (maxC === r)      hue = 60 * (((g - b) / delta) % 6);
          else if (maxC === g) hue = 60 * ((b - r) / delta + 2);
          else                 hue = 60 * ((r - g) / delta + 4);
          if (hue < 0) hue += 360;
          hueBuckets[Math.floor(hue / 10) % 36]++;
        }
        const minBucketPx = pixelCount * 0.008; // 0.8% threshold
        let distinctHueBuckets = 0;
        for (let b = 0; b < 36; b++) {
          if (hueBuckets[b] >= minBucketPx) distinctHueBuckets++;
        }

        // ── 4. Luminance anomaly hotspot scanning ───────────────────────
        // Finds bright isolated clusters in dark fields
        const anomalyHotspots = [];
        const step = 10;
        for (let y = step; y < H - step; y += step) {
          for (let x = step; x < W - step; x += step) {
            const centerLum = lumGrid[y * W + x];
            if (centerLum < 100) continue; // must be a bright spot
            let surroundSum = 0, count = 0;
            for (let dy = -step; dy <= step; dy += step) {
              for (let dx = -step; dx <= step; dx += step) {
                if (dx === 0 && dy === 0) continue;
                surroundSum += lumGrid[(y + dy) * W + (x + dx)];
                count++;
              }
            }
            const surroundAvg = surroundSum / count;
            if (centerLum - surroundAvg > 50) {
              anomalyHotspots.push({
                xPercent: (x / W) * 100,
                yPercent: (y / H) * 100,
                intensity: Math.min(100, Math.round(centerLum - surroundAvg)),
              });
            }
          }
        }

        // ── 5. Filename keyword analysis ────────────────────────────────
        const nameLower = (file.name || '').toLowerCase();
        const ghostKeywords = [
          'ghost','spooky','haunt','creepy','demon','horror','scary',
          'shadow','specter','phantom','apparition','spirit','entity',
          'grave','cemetery','corpse','skull','death','dead','poltergeist',
          'wraith','witch','zombie','nightmare','curse','paranormal','gore',
          'blood','monster','evil','satan','devil'
        ];
        const normalKeywords = [
          'selfie','sun','sunny','day','beach','family','vacation','trip',
          'dog','cat','pet','puppy','kitten','flower','garden','park','food',
          'car','smile','birthday','clean','nature','landscape','photo',
          'img','image','pic','screenshot','wallpaper','sky','road','street'
        ];
        const hasGhostKeyword  = ghostKeywords.some(k => nameLower.includes(k));
        const hasNormalKeyword = normalKeywords.some(k => nameLower.includes(k));

        // ── 6. Multi-feature ghost scoring ─────────────────────────────
        // Each scary feature adds to a score. Normal features subtract.
        // Only images with a HIGH combined ghost score get > 5.
        let ghostScore = 0;

        // POSITIVE ghost indicators (must have several)
        if (darkRatio > 0.45)   ghostScore += 3;  // very dark image
        else if (darkRatio > 0.35) ghostScore += 1;
        
        if (avgSat < 0.12)       ghostScore += 3;  // near-greyscale (desaturated/monochrome)
        else if (avgSat < 0.20)  ghostScore += 2;
        else if (avgSat < 0.28)  ghostScore += 1;

        if (distinctHueBuckets <= 3)  ghostScore += 3;  // very few colors
        else if (distinctHueBuckets <= 6) ghostScore += 1;

        if (brightRatio > 0.03 && darkRatio > 0.40) ghostScore += 2; // bright orbs in dark
        if (anomalyHotspots.length >= 3) ghostScore += 2;
        else if (anomalyHotspots.length >= 1 && darkRatio > 0.38) ghostScore += 1;

        if (hasGhostKeyword) ghostScore += 4;

        // NEGATIVE / normal indicators (strongly prevent false positives)
        if (fleshRatio > 0.04)      ghostScore -= 4;  // skin tones = living people
        if (fleshRatio > 0.08)      ghostScore -= 3;  // even more skin
        if (avgSat > 0.32)          ghostScore -= 3;  // vivid colourful image
        if (avgSat > 0.25)          ghostScore -= 2;
        if (avgLum > 110)           ghostScore -= 2;  // bright image overall
        if (avgLum > 140)           ghostScore -= 2;  // very bright
        if (darkRatio < 0.25)       ghostScore -= 3;  // not dark enough
        if (distinctHueBuckets >= 10) ghostScore -= 3; // many colors = normal photo
        if (distinctHueBuckets >= 7)  ghostScore -= 1;
        if (hasNormalKeyword)       ghostScore -= 3;

        // Strong colour channels (like a car, blue sky, green grass)
        const rDom = avgR > avgG * 1.3 && avgR > avgB * 1.3;  // red dominant
        const gDom = avgG > avgR * 1.25 && avgG > avgB * 1.25; // green dominant
        const bDom = avgB > avgR * 1.25 && avgB > avgG * 1.25; // blue dominant
        if ((gDom || bDom) && avgSat > 0.20) ghostScore -= 2; // colored scene = not ghost

        // Headlights / streetlights false positive prevention:
        // A dark image with bright spots but moderate saturation is likely a night photo (car/city), not a ghost
        if (darkRatio > 0.35 && brightRatio > 0.02 && avgSat > 0.18 && avgSat < 0.40 && !hasGhostKeyword) {
          ghostScore -= 3; // "dark with colored lights" = street/car/party photo
        }

        // ── 7. Final classification ─────────────────────────────────────
        // isReallyScary ONLY when ghostScore is HIGH (≥6)
        const isReallyScary = ghostScore >= 6;
        const isClearlyNormal = ghostScore <= 1;

        let suggestedSeverity;
        let isNormal = false;
        let matchedCategory = '';
        let customGhostType = '';
        let observation = '';
        let paranormalProbability = 0.15;

        if (isReallyScary) {
          // ── REALLY SCARY: 8–10 ─────────────────────────────────────
          isNormal = false;
          paranormalProbability = Math.min(0.97, 0.80 + (ghostScore - 6) * 0.03 + (hasGhostKeyword ? 0.10 : 0));

          if (ghostScore >= 10 || hasGhostKeyword) {
            suggestedSeverity = Math.random() > 0.4 ? 9 : 10;
          } else {
            suggestedSeverity = 8;
          }

          if (avgSat < 0.14 && brightRatio > 0.02) {
            matchedCategory = 'spectral_apparition';
            customGhostType = 'Translucent Apparition of the Veil';
            observation = `DIRECT SPECTRAL CONFIRMATION: A luminous, desaturated spiritual figure (${Math.round((1 - avgSat) * 100)}% pallor) is actively phasing into physical reality.`;
          } else if (darkRatio > 0.50) {
            matchedCategory = 'shadow_abyss';
            customGhostType = 'The Rotting Shadow Stalker of the Void';
            observation = `CRITICAL TELEMETRY WARNING: Deep photon-swallowing darkness (${Math.round(darkRatio * 100)}% shadow field). An ancient malevolent presence is staring back through the focal boundary.`;
          } else if (anomalyHotspots.length >= 2) {
            matchedCategory = 'hostile_poltergeist';
            customGhostType = 'Vengeful Kinetic Poltergeist';
            observation = `MULTIPLE ANOMALY CLUSTERS DETECTED: ${anomalyHotspots.length} concentrated optical hotspots radiating chaotic paranormal excitation.`;
          } else {
            matchedCategory = 'pure_horror';
            customGhostType = 'Class VI Cataclysmic Apparition';
            observation = `HAUNTING VERIFIED: Severe electromagnetic disturbance and unnatural spectral distortion detected across the subject.`;
          }
        } else if (isClearlyNormal) {
          // ── CLEARLY NORMAL: 1–2 ────────────────────────────────────
          isNormal = true;
          suggestedSeverity = Math.max(1, Math.min(2, Math.round(1 + (darkRatio > 0.15 ? 1 : 0))));
          paranormalProbability = 0.10;
          matchedCategory = 'mortal_safe';
          customGhostType = 'Living Mortal Realm (Harmless)';
          const normalObservations = [
            `Optical spectroscopy confirms natural biological illumination (${Math.round(avgLum)}/255 lux) and vibrant living pigment. Zero supernatural intrusion.`,
            `Harmonic resonance registers 100% mortal warmth. No spectral anomalies, cold zones, or ectoplasmic residue present.`,
            `Telemetry confirmed pure mundane composition: balanced colour distribution with zero disembodied entities in frame.`,
          ];
          observation = normalObservations[Math.floor(Math.random() * normalObservations.length)];
        } else {
          // ── AMBIGUOUS / MILDLY MOODY: 3–5 ─────────────────────────
          isNormal = false;
          if (ghostScore <= 3) {
            suggestedSeverity = 3;
            paranormalProbability = 0.25;
          } else if (ghostScore <= 4) {
            suggestedSeverity = 4;
            paranormalProbability = 0.38;
          } else {
            suggestedSeverity = 5;
            paranormalProbability = 0.50;
          }
          matchedCategory = 'residual_echo';
          customGhostType = 'Class III Residual Memory Wraith';
          observation = `Mild shadow depth in the periphery (${Math.round(darkRatio * 100)}% dark field). A quiet residual resonance lingers — well below emergency threat thresholds.`;
        }

        resolve({
          isNormal,
          isReallyScary,
          paranormalProbability: parseFloat(paranormalProbability.toFixed(2)),
          suggestedSeverity,
          matchedCategory,
          customGhostType,
          observation,
          anomalyHotspots,
          metrics: {
            avgLum: Math.round(avgLum),
            avgSat: parseFloat(avgSat.toFixed(2)),
            darkRatio: parseFloat(darkRatio.toFixed(2)),
            brightRatio: parseFloat(brightRatio.toFixed(2)),
            fleshRatio: parseFloat(fleshRatio.toFixed(2)),
            distinctHues: distinctHueBuckets,
            ghostScore,
            hotspotsCount: anomalyHotspots.length,
          },
        });
      } catch (e) {
        console.error('Image analysis error:', e);
        resolve({
          isNormal: true,
          isReallyScary: false,
          paranormalProbability: 0.20,
          suggestedSeverity: 2,
          observation: 'Sensors register baseline mortal illumination.',
          matchedCategory: 'mortal_safe',
          customGhostType: 'Living Mortal Realm (Harmless)',
          anomalyHotspots: [],
        });
      }
    };

    img.onerror = () => {
      resolve({
        isNormal: true,
        isReallyScary: false,
        paranormalProbability: 0.15,
        suggestedSeverity: 1,
        observation: 'Image telemetry registers as baseline mortal frame.',
        matchedCategory: 'mortal_safe',
        customGhostType: 'Harmless Mortal Artifact',
        anomalyHotspots: [],
      });
    };

    img.src = url;
  });
}
