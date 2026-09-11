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
  // ── Benign / Normal / Safe Archetypes (Severity 1-3) ──
  {
    type: 'Living Mortal Realm (Harmless)',
    matchKey: 'mortal_safe',
    isBenign: true,
    threat: 'Class 0 Mundane Entity',
    spectralSignature: 'Normal biological thermal equilibrium & balanced daylight photons',
    dangerPhrase: 'Paranormal threat: 0.00%. The subjects are completely mortal, safe, and alive.',
    advice: 'No salt, sage, or emergency prayers required. You can sleep peacefully tonight with the lights off.',
    verdicts: [
      'Our optical and thermal sensors confirm a completely mundane biological environment. There are NO ghosts, apparitions, or demonic entities inhabiting this frame. It is a completely normal photograph taken in the mortal world.',
      'Spectral telemetry registers zero ethereal density. The light patterns and reflections are 100% natural daylight and ambient luminescence. Congratulations: your location is completely free of paranormal contamination.',
    ],
  },
  {
    type: 'Airborne Dust Particle Swarm',
    matchKey: 'dust_false_alarm',
    isBenign: true,
    threat: 'Class 0 Environmental Artifact',
    spectralSignature: 'Microscopic domestic dust refraction caught in camera exposure',
    dangerPhrase: 'The only real danger is allergic sneezing or needing a feather duster.',
    advice: 'Wipe your camera lens with a clean cloth and turn off harsh direct flash.',
    verdicts: [
      'Our initial sensors detected tiny floating specks, but microscopic spectroscopic analysis confirms these are ordinary domestic dust particles caught in the camera flash. A completely harmless false alarm.',
      'Spectral analysis returned pure particulate matter. No ectoplasm, no spiritual residue, and no disembodied entities. Just ambient dust floating peacefully.',
    ],
  },

  // ── Moderate / Residual Archetypes (Severity 4-6) ──
  {
    type: 'Class III Residual Memory Wraith',
    matchKey: 'wraith',
    isBenign: false,
    threat: 'Class III Melancholic Residual',
    spectralSignature: 'Sub-audible 14Hz infrasound resonance & mild thermal sink',
    dangerPhrase: 'Emotional resonance is lingering in the drywall; causes sudden unexplained chills.',
    advice: 'Turn on bright lights, play upbeat music, and open windows to air out stagnant energy.',
    verdicts: [
      'The readings align with the profile of a Class III Residual Memory. The localized photon displacement suggests a past emotional imprint trapped in the environment rather than a conscious malevolent hunter.',
      'Notice that slight drop in temperature? Our sensors logged a localized thermal sink. A phantom memory is replaying its final footsteps in this space.',
    ],
  },
  {
    type: 'Chaotic Gremlin of Sub-Level 4',
    matchKey: 'gremlin',
    isBenign: false,
    threat: 'Class II Mischievous Imp',
    spectralSignature: 'Micro-EMF bursts & high-frequency static chirps',
    dangerPhrase: 'High risk of misplaced car keys, drained phone batteries, and flickering screens.',
    advice: 'Leave a shiny coin and sea salt on the table as an appeasement offering.',
    verdicts: [
      'Our spectral array logged erratic, annoying micro-fluctuations typical of a minor nuisance imp. It thrives on domestic mischief, tripping circuit breakers and hiding small objects.',
      'The evidence points to chaotic interference. We observed minor micro-surges in energy accompanied by optical static. Your Wi-Fi router might be its next plaything.',
    ],
  },

  // ── Severe / Truly Scary Horror Archetypes (Severity 7-10) ──
  {
    type: 'The Rotting Shadow Stalker of the Void',
    matchKey: 'shadow',
    isBenign: false,
    threat: 'Class VI Cataclysmic Apex Demon',
    spectralSignature: 'Absolute photon collapse, necrotic zero-point decay, dimensional rupture',
    dangerPhrase: 'CRITICAL THREAT: The entity has locked onto your consciousness through the screen. It knows you are looking.',
    advice: 'EVACUATE IMMEDIATELY. DO NOT TURN OFF YOUR LIGHTS. DO NOT LOOK BEHIND YOU. IT IS ALREADY IN THE ROOM.',
    verdicts: [
      'MAY HEAVEN HELP US ALL. The darkness in this photograph is not an absence of light — it is an ancient, predatory entity feeding on the mortal plane. Deep optical telemetry reveals hollow, unblinking eyes staring directly back at you.',
      'Take a terrifying look at your surroundings. What appeared to be a photograph holds a Class VI Abyssal Stalker that has detached itself from the two-dimensional frame. Every sensor redlined in pure panic. Run.',
    ],
  },
  {
    type: 'Vengeful Kinetic Poltergeist',
    matchKey: 'poltergeist',
    isBenign: false,
    threat: 'Class V Violent Manifestation',
    spectralSignature: 'Violent gravitational distortion, redline EMF spikes, sonic cavitation',
    dangerPhrase: 'Extreme kinetic violence hazard: heavy airborne furniture, shattered mirrors, and physical scratching.',
    advice: 'Clear the area of glass and sharp objects immediately. Barricade doors and seek consecrated ground.',
    verdicts: [
      'Our instruments went completely ballistic! This is an agitated, deeply malevolent Poltergeist. The energetic pressure is high enough to bend metal and throw heavy furniture across the room without warning.',
      'Emergency containment warning! The photographic emulsion is warped by high-velocity kinetic distortion. This entity is violent, territorial, and actively escalating.',
    ],
  },
  {
    type: 'The Weeping Cryo-Specter of the Abyss',
    matchKey: 'cryo',
    isBenign: false,
    threat: 'Class V Frigid Banshee',
    spectralSignature: 'Sudden -40°C thermal sink & bone-shivering infrasound hysteria',
    dangerPhrase: 'Suffocating chest constriction, auditory hallucinations, and paralyzing terror.',
    advice: 'Cover your ears if you hear faint sobbing in the hallway. Do not answer if your name is whispered.',
    verdicts: [
      'Thermal imaging registered an impossible sub-zero vortex at the core of the image. The Weeping Specter drains heat directly from living lungs to sustain her terrifying presence.',
      'A bone-chilling aura permeates the frame. Those who encounter this entity report freezing numbness and the suffocating feeling of ice-cold hands pressing against the throat.',
    ],
  },
  {
    type: 'Ancient Eldritch Cataclysm',
    matchKey: 'eldritch',
    isBenign: false,
    threat: 'Class VI Primordial Void-Bender',
    spectralSignature: 'Spatiotemporal rupture, reality membrane integrity below 8%',
    dangerPhrase: 'Warning: physical reality around this location is destabilizing into nightmare space.',
    advice: 'DO NOT SPEAK ITS NAME. BURN THE EVIDENCE. FORGET EVERYTHING YOU SAW.',
    verdicts: [
      'The diagnostic metrics recorded here transcend human comprehension. We are dealing with an ancient primordial horror that pre-dates mortal civilization. It does not belong to this plane of existence.',
      'Sensory overload across every paranormal channel. Reality itself is warping around the subject. What our detector uncovered should never have been awakened.',
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
      max_tokens: 120,
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
              text: 'Analyze this image critically for a paranormal game. First determine if this is a completely normal, well-lit everyday photo (like a normal selfie, food, daylight landscape, clean room) OR if it has genuinely creepy/dark/spooky qualities. If normal, state in 1 sentence that it is completely safe and free of anomalies. If creepy, describe in 1 chilling sentence the dark anomaly, shadow, or eerie presence. Keep under 25 words.',
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
  const {
    orbCount = 0,
    photoObservation,
    coldSpotCount = 0,
    emfSpikeCount = 0,
    evpCount = 0,
    suggestedGhostType,
    isNormal = false,
    isReallyScary = false,
    paranormalProbability = 0.5,
    suggestedSeverity = null,
  } = req.body;

  const obsLower = ((photoObservation || '') + ' ' + (suggestedGhostType || '')).toLowerCase();

  // STRICT RULE: Only images that look REALLY SCARY get MORE THAN 5 (>5)!
  // All other images (normal, daylight, pets, standard rooms, ambiguous) get 5 OR LESS (<=5).
  const verifiedReallyScary = isReallyScary === true || (suggestedSeverity !== null && suggestedSeverity > 5) || (paranormalProbability >= 0.60);

  let calculatedSeverity;
  let archetype = null;

  if (!verifiedReallyScary) {
    // ── CANNOT EXCEED 5 (strictly 1 to 5) ──
    const isMortalSafe = isNormal || (suggestedSeverity !== null && suggestedSeverity <= 3) || paranormalProbability < 0.40;

    if (isMortalSafe) {
      // Normal daylight / living picture: strictly 1 to 3
      calculatedSeverity = suggestedSeverity ? Math.max(1, Math.min(3, suggestedSeverity)) : Math.max(1, Math.min(3, Math.round(1 + (orbCount * 0.4))));
      if (obsLower.includes('dust') || orbCount > 0) {
        archetype = GHOST_ARCHETYPES.find(a => a.matchKey === 'dust_false_alarm');
      } else {
        archetype = GHOST_ARCHETYPES.find(a => a.matchKey === 'mortal_safe');
      }
    } else {
      // Ambiguous / dim / moody but NOT really scary: strictly 4 or 5
      calculatedSeverity = suggestedSeverity ? Math.max(4, Math.min(5, suggestedSeverity)) : 4;
      if (obsLower.includes('gremlin') || obsLower.includes('imp')) {
        archetype = GHOST_ARCHETYPES.find(a => a.matchKey === 'gremlin');
      } else {
        archetype = GHOST_ARCHETYPES.find(a => a.matchKey === 'wraith');
      }
    }
  } else {
    // ── REALLY SCARY: strictly MORE THAN 5 (>5, i.e. 6 to 10, typically 7-10) ──
    if (suggestedSeverity) {
      calculatedSeverity = Math.max(6, Math.min(10, suggestedSeverity));
    } else {
      calculatedSeverity = Math.min(10, Math.max(7, Math.round(7.5 + ((orbCount + coldSpotCount + emfSpikeCount) * 0.3))));
    }

    if (obsLower.includes('shadow') || obsLower.includes('abyss') || obsLower.includes('void') || obsLower.includes('dark')) {
      archetype = GHOST_ARCHETYPES.find(a => a.matchKey === 'shadow');
    } else if (obsLower.includes('poltergeist') || obsLower.includes('kinetic') || emfSpikeCount > 2) {
      archetype = GHOST_ARCHETYPES.find(a => a.matchKey === 'poltergeist');
    } else if (obsLower.includes('cryo') || obsLower.includes('cold') || coldSpotCount > 2) {
      archetype = GHOST_ARCHETYPES.find(a => a.matchKey === 'cryo');
    } else {
      archetype = GHOST_ARCHETYPES.find(a => a.matchKey === 'shadow') || GHOST_ARCHETYPES.find(a => a.matchKey === 'eldritch');
    }
  }

  if (!archetype) {
    archetype = GHOST_ARCHETYPES[0];
  }

  if (!anthropic) {
    return res.json(generateDynamicReport(req.body, archetype, calculatedSeverity));
  }

  const statLines = [];
  statLines.push(`- Entity Classification Profile: ${archetype.type} (${archetype.threat})`);
  statLines.push(`- Is Benign/Safe: ${archetype.isBenign ? 'YES (MORTAL SAFE)' : 'NO (PARANORMAL ENTITY)'}`);
  if (orbCount !== undefined) statLines.push(`- Orb sightings: ${orbCount}`);
  if (photoObservation) statLines.push(`- Photo observation: ${photoObservation}`);
  if (coldSpotCount !== undefined) statLines.push(`- Cold spots detected: ${coldSpotCount}`);
  if (emfSpikeCount !== undefined) statLines.push(`- EMF anomalies: ${emfSpikeCount}`);
  if (evpCount !== undefined) statLines.push(`- EVP captures: ${evpCount}`);

  const userPrompt = `Scan results:\n${statLines.join('\n')}\n\nDeliver your final paranormal verdict including entity profile (${archetype.type}), observations, and advice. Remember severity score is ${calculatedSeverity}/10.`;

  const systemPrompt = archetype.isBenign
    ? `You are an honest paranormal investigator who confirms that this photo is completely safe and mortal. No ghosts exist in this photo. Keep under 120 words. End with 'Haunting Severity: ${calculatedSeverity}/10' and a reassuring closing line.`
    : `You are a terrified, dead-serious paranormal investigator delivering a chilling verdict about a genuine supernatural horror. Your tone is terrifying, bone-chilling, and atmospheric horror. Reference the observed stats. Keep under 140 words. End with 'Haunting Severity: ${calculatedSeverity}/10' and a chilling final warning.`;

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
      isBenign: archetype.isBenign,
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
    observations.push(`Optical sensors revealed key telemetry: "${photoObservation}"`);
  }
  if (orbCount > 0) {
    observations.push(`We logged ${orbCount} localized optical anomaly point${orbCount > 1 ? 's' : ''}.`);
  }
  if (coldSpotCount > 0) {
    observations.push(`Thermal sensors registered ${coldSpotCount} localized cooling zones.`);
  }
  if (emfSpikeCount > 0) {
    observations.push(`Electromagnetic meters registered ${emfSpikeCount} anomalous high-frequency spikes.`);
  }
  if (evpCount > 0) {
    observations.push(`Acoustic telemetry recorded ${evpCount} anomalous vocal wave-peaks.`);
  }

  const observationSummary = observations.length > 0
    ? observations.join(' ')
    : (archetype.isBenign ? 'All environmental channels remain at undisturbed biological baseline.' : 'Even in quiet moments, the suffocating presence is undeniable.');

  const fullVerdict = `${intro}\n\n${observationSummary}\n\n${archetype.isBenign ? '✅ INVESTIGATOR VERDICT' : '⚠️ INVESTIGATOR ADVICE'}: ${archetype.advice} ${archetype.dangerPhrase}\n\nHaunting Severity: ${severity}/10.`;

  return {
    verdict: fullVerdict,
    severity,
    ghostName: archetype.type,
    threatClass: archetype.threat,
    spectralSignature: archetype.spectralSignature,
    isBenign: archetype.isBenign,
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
