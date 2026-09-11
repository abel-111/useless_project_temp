import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize Anthropic client (only if user provided a valid non-placeholder key)
const isKeyProvided = process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes('your_api_key_here');
const anthropic = isKeyProvided ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

// Dynamic realistic ghost archetypes with custom icons & traits
const GHOST_ARCHETYPES = [
  {
    type: 'Phantom Champion of the Celestial Arena',
    matchKey: 'athlete',
    threat: 'Class S Legend Avatar',
    spectralSignature: 'Superluminal kinetic acceleration & golden-ratio aura',
    dangerPhrase: 'Target displays supernatural speed, gravitational defiance, and impossible dribbling.',
    advice: 'Do not attempt a sliding tackle on this apparition. Applaud politely and pray for mercy.',
    verdicts: [
      'Holy mother of specters... This is NOT an ordinary haunting. Our telemetry detected an omnipotent spectral athletic deity. The radiant aura and celestial velocity signature indicate a champion who has achieved immortality beyond the mortal realm.',
      'Analysis indicates the presence of a supreme athletic demigod. Photonic analysis shows 8-axis gravitational bending around the subject. Every defender in the physical and spiritual realm has already been bypassed.',
    ],
  },
  {
    type: 'Poltergeist of the Victorian Era',
    matchKey: 'poltergeist',
    threat: 'Class IV Kinetic Apparition',
    spectralSignature: 'Cold kinetic vortex & disrupted electron flux',
    dangerPhrase: 'Extreme kinetic hazard — protect fragile chinaware immediately.',
    advice: 'Do not make eye contact with mirrors or stack objects taller than three inches.',
    verdicts: [
      'Good heavens. We have confirmed a full-spectrum Victorian Poltergeist roaming this perimeter. The photographic analysis detected ethereal dislocation, and the energetic spikes point to a spirit obsessed with rearranging everyday reality.',
      'Our sensors went ballistic with kinetic fluctuations. This is not mere ambient disturbance — this is a textbook Victorian haunting with a penchant for slamming phantom doors and chilling room temperatures down to bone-numbing levels.',
    ],
  },
  {
    type: 'Shadow Figure Lurker',
    matchKey: 'shadow',
    threat: 'Class V Umbral Entity',
    spectralSignature: 'Photonic absorption anomaly & localized zero-point decay',
    dangerPhrase: 'Perimeter breached: darkness is actively observing from peripheral vision.',
    advice: 'Avoid dark corridors and do not turn off your nightlights under any circumstances.',
    verdicts: [
      'The optical telemetry has uncovered a Class V Umbral Entity — commonly known as a Shadow Stalker. It does not reflect light; it swallows it whole. Every pixel examined exhibits unnatural luminescence deprivation.',
      'Take a very close look at your surroundings. What appeared to be a harmless photograph holds an undeniable silhouette that has detached itself from the laws of physics. It watches when no one is looking.',
    ],
  },
  {
    type: 'The Weeping Widow of the North Hall',
    matchKey: 'wraith',
    threat: 'Class III Melancholic Wraith',
    spectralSignature: 'Sub-audible infrasound oscillation & thermal sink',
    dangerPhrase: 'Emotional resonance is dangerously intoxicating and cold.',
    advice: 'Play upbeat synth-pop music to confuse and disrupt the melancholy frequencies.',
    verdicts: [
      'The readings align with the tragic profile of a Melancholic Wraith. The spatial anomalies recorded suggest a wandering soul searching endlessly for a lost relic or broken promise.',
      'Notice that sudden drop in room temperature? That is the classic calling card of the Weeping Specter. She drains heat directly from the living atmosphere to maintain her translucent presence.',
    ],
  },
  {
    type: 'Chaotic Gremlin of Sub-Level 4',
    matchKey: 'gremlin',
    threat: 'Class II Mischievous Imp',
    spectralSignature: 'Micro-EMF bursts & high-frequency static chirps',
    dangerPhrase: 'High risk of misplaced keys, drained phone batteries, and unexplained knocking.',
    advice: 'Leave a bowl of shiny coins and salt on the countertop as an appeasement offering.',
    verdicts: [
      'Our spectral array has logged sporadic, erratic fluctuations characteristic of an impish anomaly. This entity thrives on minor domestic chaos, flickering screens, and mysterious thumps behind the drywall.',
      'The evidence screams chaotic interference! We observed sudden micro-surges in energy accompanied by erratic optical disturbances. You are not alone — and your Wi-Fi router is likely its next victim.',
    ],
  },
  {
    type: 'Ancient Eldritch Residual',
    matchKey: 'eldritch',
    threat: 'Class VI Cataclysmic Echo',
    spectralSignature: 'Spatiotemporal rupture & primordial audio resonance',
    dangerPhrase: 'Warning: reality membrane integrity currently below 42%.',
    advice: 'EVACUATE IMMEDIATELY. Or at least do not recite any Latin backwards tonight.',
    verdicts: [
      'May heaven help us all. The diagnostic metrics recorded here transcend standard paranormal taxonomy. We are dealing with an Ancient Residual Echo that pre-dates modern civil engineering.',
      'The energy imprint captured in this scan does not belong to this century — or possibly this dimension. What our detectors picked up is an ancient presence awakening from a centuries-long slumber.',
    ],
  },
];

// ──────────────────────────────────────────
// POST /api/analyze-photo
// ──────────────────────────────────────────
app.post('/api/analyze-photo', async (req, res) => {
  const { image, mediaType } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  if (!anthropic) {
    // Handled by client-side real pixel & metadata analysis
    return res.json({ observation: null });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType || 'image/jpeg',
                data: image,
              },
            },
            {
              type: 'text',
              text: 'Look at this image and describe, in one ominous sentence, one specific vague or ambiguous visual detail (a shadow, a reflection, an odd shape, unusual lighting) as if it could be paranormal. Be specific to what\'s actually in the image. Keep it under 25 words.',
            },
          ],
        },
      ],
    });

    const observation = message.content[0]?.text || null;
    res.json({ observation });
  } catch (err) {
    console.error('Claude Vision API error:', err.message);
    res.json({ observation: null });
  }
});

// ──────────────────────────────────────────
// POST /api/report
// ──────────────────────────────────────────
app.post('/api/report', async (req, res) => {
  const { orbCount = 0, photoObservation, coldSpotCount = 0, emfSpikeCount = 0, evpCount = 0, suggestedGhostType } = req.body;

  // Match archetype based on photo observation / suggestedGhostType
  let archetype = null;
  const obsLower = ((photoObservation || '') + ' ' + (suggestedGhostType || '')).toLowerCase();

  if (obsLower.includes('champion') || obsLower.includes('athletic') || obsLower.includes('legend') || obsLower.includes('arena')) {
    archetype = GHOST_ARCHETYPES.find(a => a.matchKey === 'athlete');
  } else if (obsLower.includes('shadow') || obsLower.includes('abyss') || obsLower.includes('umbral') || obsLower.includes('photonic')) {
    archetype = GHOST_ARCHETYPES.find(a => a.matchKey === 'shadow');
  } else if (obsLower.includes('cryo') || obsLower.includes('frost') || obsLower.includes('blue') || obsLower.includes('widow')) {
    archetype = GHOST_ARCHETYPES.find(a => a.matchKey === 'wraith');
  } else if (obsLower.includes('eldritch') || obsLower.includes('void') || obsLower.includes('pyre') || obsLower.includes('strobe')) {
    archetype = GHOST_ARCHETYPES.find(a => a.matchKey === 'eldritch');
  } else if (obsLower.includes('gremlin') || obsLower.includes('imp') || obsLower.includes('familiar')) {
    archetype = GHOST_ARCHETYPES.find(a => a.matchKey === 'gremlin');
  }

  if (!archetype) {
    // Pick randomly if no strong keyword
    archetype = GHOST_ARCHETYPES[Math.floor(Math.random() * GHOST_ARCHETYPES.length)];
  }

  // Calculate a dynamic severity score (4 to 10)
  const basePoints = (orbCount * 0.4) + (coldSpotCount * 1.1) + (emfSpikeCount * 1.4) + (evpCount * 1.8);
  const calculatedSeverity = Math.min(Math.max(Math.round(basePoints + (Math.random() * 2 + 4)), 4), 10);

  if (!anthropic) {
    return res.json(generateDynamicReport(req.body, archetype, calculatedSeverity));
  }

  const statLines = [];
  statLines.push(`- Entity Classification Profile: ${archetype.type} (${archetype.threat})`);
  if (orbCount !== undefined) statLines.push(`- Orb sightings: ${orbCount}`);
  if (photoObservation) statLines.push(`- Photo observation: ${photoObservation}`);
  if (coldSpotCount !== undefined) statLines.push(`- Cold spots detected: ${coldSpotCount}`);
  if (emfSpikeCount !== undefined) statLines.push(`- EMF anomalies: ${emfSpikeCount}`);
  if (evpCount !== undefined) statLines.push(`- EVP captures: ${evpCount}`);

  const userPrompt = `Scan results:\n${statLines.join('\n')}\n\nDeliver your final theatrical paranormal verdict including the ghost's identity (${archetype.type}), the observed stats, and survival advice.`;

  const systemPrompt = `You are a dramatic, TV-style paranormal investigator delivering a final verdict after a 'scan.' Your tone is theatrical, over-the-top serious, and slightly ominous — think reality TV ghost hunter, not actually scary. Reference the specific stats and observations given to you. You never break character. Keep under 150 words. End with 'Haunting Severity: ${calculatedSeverity}/10' and one punchy closing line.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const verdictText = message.content[0]?.text || '';
    const severityMatch = verdictText.match(/(\d+)\s*\/\s*10/);
    const severity = severityMatch ? parseInt(severityMatch[1]) : calculatedSeverity;

    res.json({
      verdict: verdictText,
      severity,
      ghostName: archetype.type,
      threatClass: archetype.threat,
      spectralSignature: archetype.spectralSignature,
    });
  } catch (err) {
    res.json(generateDynamicReport(req.body, archetype, calculatedSeverity));
  }
});

function generateDynamicReport(stats, archetype, severity) {
  const { orbCount = 0, photoObservation, coldSpotCount = 0, emfSpikeCount = 0, evpCount = 0 } = stats;

  const intro = archetype.verdicts[Math.floor(Math.random() * archetype.verdicts.length)];
  const observations = [];

  if (photoObservation) {
    observations.push(`Optical sensors revealed a key observation: "${photoObservation}"`);
  }
  if (orbCount > 0) {
    observations.push(`We documented ${orbCount} spirit orb manifest point${orbCount > 1 ? 's' : ''} lingering across coordinates.`);
  }
  if (coldSpotCount > 0) {
    observations.push(`Thermal imaging registered ${coldSpotCount} localized freezing vortexes.`);
  }
  if (emfSpikeCount > 0) {
    observations.push(`Electromagnetic meters redlined ${emfSpikeCount} times under high-frequency spectral excitation.`);
  }
  if (evpCount > 0) {
    observations.push(`Acoustic EVP telemetry isolated ${evpCount} distinct disembodied vocalizations.`);
  }

  const observationSummary = observations.length > 0
    ? observations.join(' ')
    : 'Even in quiet baseline readings, the spectral pressure remains suffocatingly palpable.';

  const fullVerdict = `${intro}\n\n${observationSummary}\n\n⚠️ INVESTIGATOR ADVICE: ${archetype.advice} ${archetype.dangerPhrase}\n\nHaunting Severity: ${severity}/10.`;

  return {
    verdict: fullVerdict,
    severity,
    ghostName: archetype.type,
    threatClass: archetype.threat,
    spectralSignature: archetype.spectralSignature,
  };
}

// ──────────────────────────────────────────
// Health check
// ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', apiConfigured: !!anthropic });
});

app.listen(PORT, () => {
  console.log(`👻 Ghost Detector API running on port ${PORT}`);
  if (!anthropic) {
    console.log('⚠️  Using intelligent contextual pixel-analysis paranormal engine');
  }
});
