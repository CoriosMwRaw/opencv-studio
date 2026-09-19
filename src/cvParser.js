/**
 * OpenCV Studio - cvParser.js
 * Motor Heurístico Inteligente para Extracción y Análisis de Currículums
 * Permite transformar texto plano no estructurado (copiado de PDF, Word, LinkedIn o TXT)
 * en un perfil estructurado y listo para el editor de OpenCV Studio.
 */

window.cvParser = (function() {
  'use strict';

  function normalizeText(text) {
    if (!text) return '';
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/[\u200B-\u200D\uFEFF]/g, '');
  }

  function extractContact(text) {
    const contact = {
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: ''
    };

    // 1. Email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) contact.email = emailMatch[0].trim();

    // 2. Teléfono / WhatsApp
    const phoneMatch = text.match(/(?:\+?52\s?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{4}/);
    if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 8) {
      contact.phone = phoneMatch[0].trim();
    }

    // 3. LinkedIn
    const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i) ||
                          text.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
    if (linkedinMatch) {
      contact.linkedin = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : 'https://' + linkedinMatch[0];
    }

    // 4. GitHub
    const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
    if (githubMatch) {
      contact.github = githubMatch[0].startsWith('http') ? githubMatch[0] : 'https://' + githubMatch[0];
    }

    // 5. Portafolio / Web
    const urlMatch = text.match(/https?:\/\/(?!www\.linkedin|linkedin|github)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s]*/i);
    if (urlMatch) {
      contact.website = urlMatch[0].trim();
    }

    // 6. Ubicación aproximada
    const locationKeywords = /(?:Jalisco|Guadalajara|CDMX|Ciudad de M[eé]xico|Zapopan|Tepatitl[aán]|Monterrey|Puebla|Quer[eé]taro|Tijuana|M[eé]xico|Leon|Toluca|Chihuahua|M[eé]rida)/i;
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines.slice(0, 15)) {
      if (locationKeywords.test(line) && !line.includes('@') && !line.toLowerCase().includes('experiencia')) {
        contact.location = line.replace(/^[•\-\*]\s*/, '').trim();
        break;
      }
    }

    return contact;
  }

  function extractNameAndHeadline(lines, contact) {
    let fullName = '';
    let headline = '';

    const reservedHeaders = /^(curriculum|curriculum vitae|resume|hoja de vida|cv|datos personales|contacto|perfil|experiencia)$/i;

    for (let i = 0; i < Math.min(lines.length, 6); i++) {
      const line = lines[i].trim();
      if (!line) continue;
      if (reservedHeaders.test(line)) continue;
      if (line.includes('@') || line.includes('http') || (contact.phone && line.includes(contact.phone))) continue;

      const words = line.split(/\s+/);
      if (words.length >= 2 && words.length <= 5 && line.length < 50 && !/\d/.test(line)) {
        fullName = line;
        if (lines[i + 1]) {
          const next = lines[i + 1].trim();
          if (next && !reservedHeaders.test(next) && !next.includes('@') && next.length < 60) {
            headline = next;
          }
        }
        break;
      }
    }

    if (!headline) {
      const headlineRegex = /(?:Ingenier[oa]|Desarrollador[a]|Licenciad[oa]|Analista|Programador[a]|Especialista|Consultor|T[eé]cnico|Developer|Engineer|Architect)[^\n,.]*/i;
      for (let i = 0; i < Math.min(lines.length, 12); i++) {
        const match = lines[i].match(headlineRegex);
        if (match && lines[i] !== fullName) {
          headline = match[0].trim();
          break;
        }
      }
    }

    return { fullName, headline };
  }

  function segmentSections(rawText) {
    const sections = {
      summary: '',
      experience: '',
      education: '',
      skills: '',
      languages: '',
      projects: '',
      certifications: ''
    };

    const sectionRegexes = [
      { key: 'summary', regex: /^(?:perfil(?:\s+profesional|\s+laboral)?|resumen(?:\s+ejecutivo)?|acerca\s+de\s+m[ií]|sobre\s+m[ií]|summary|about\s+me|profile|objetivo(?:\s+profesional)?)$/i },
      { key: 'experience', regex: /^(?:experiencia(?:\s+laboral|\s+profesional)?|trayectoria(?:\s+laboral)?|historial\s+laboral|work\s+experience|employment\s+history|experience)$/i },
      { key: 'education', regex: /^(?:educaci[oó]n|formaci[oó]n(?:\s+acad[eé]mica)?|estudios|academic\s+background|education)$/i },
      { key: 'skills', regex: /^(?:habilidades(?:\s+t[eé]cnicas)?|aptitudes|skills|competencias|tecnolog[ií]as|herramientas|stack(?:\s+tecnol[oó]gico)?)$/i },
      { key: 'languages', regex: /^(?:idiomas|languages|lenguajes)$/i },
      { key: 'projects', regex: /^(?:proyectos(?:\s+destacados|\s+t[eé]cnicos)?|projects|portfolio|proyectos\s+personales)$/i },
      { key: 'certifications', regex: /^(?:certificaciones|cursos|certificados|certifications|cursos\s+y\s+certificaciones)$/i }
    ];

    const lines = rawText.split('\n');
    let currentKey = 'summary';
    let contentAccumulator = { summary: [] };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const matched = sectionRegexes.find(s => s.regex.test(line.replace(/[:\-#=]/g, '').trim()));
      if (matched) {
        currentKey = matched.key;
        if (!contentAccumulator[currentKey]) contentAccumulator[currentKey] = [];
        continue;
      }

      if (!contentAccumulator[currentKey]) contentAccumulator[currentKey] = [];
      contentAccumulator[currentKey].push(line);
    }

    for (const key in contentAccumulator) {
      sections[key] = contentAccumulator[key].join('\n');
    }

    return sections;
  }

  function parseExperience(text) {
    if (!text) return [];
    const entries = [];
    const rawLines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const datePattern = /(?:(?:ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\.?\s*)?\b(19\d{2}|20\d{2})\s*(?:-|–|a|al|to)\s*(?:(?:ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\.?\s*)?(?:\b(19\d{2}|20\d{2})\b|actualidad|presente|present|hoy)/i;

    let currentEntry = null;

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];
      const hasDate = datePattern.test(line);
      const isBullet = /^(?:[•\-\*]|\d+[\.\)]\s+)/.test(line);
      const nextHasDate = (i + 1 < rawLines.length) && datePattern.test(rawLines[i + 1]) && !/^(?:[•\-\*]|\d+[\.\)]\s+)/.test(rawLines[i + 1]);

      if (hasDate && !isBullet) {
        if (currentEntry) entries.push(finalizeExperienceEntry(currentEntry));

        const dateMatch = line.match(datePattern);
        const period = dateMatch ? dateMatch[0].trim() : '';
        const titlePart = line.replace(datePattern, '').replace(/[|•\(\)]/g, ' ').trim();

        let role = titlePart;
        let company = '';
        if (titlePart.includes(' - ') || titlePart.includes(' | ')) {
          const parts = titlePart.split(/\s*[-|]\s*/);
          role = parts[0];
          company = parts.slice(1).join(' - ');
        }

        currentEntry = {
          role: role || 'Especialista',
          company: company || 'Empresa',
          period: period,
          location: 'México',
          achievements: []
        };
      } else if (nextHasDate && !isBullet) {
        if (currentEntry) entries.push(finalizeExperienceEntry(currentEntry));

        let role = line;
        let company = '';
        if (line.includes(' - ') || line.includes(' | ')) {
          const parts = line.split(/\s*[-|]\s*/);
          role = parts[0];
          company = parts.slice(1).join(' - ');
        }

        const dateMatch = rawLines[i + 1].match(datePattern);
        const period = dateMatch ? dateMatch[0].trim() : '';
        i++; // Avanzar

        currentEntry = {
          role: role || 'Especialista',
          company: company || 'Empresa',
          period: period || '2022 - Actualidad',
          location: 'México',
          achievements: []
        };
      } else if (currentEntry) {
        const clean = line.replace(/^[•\-\*\d\.\)]+\s*/, '').trim();
        if (clean.length > 5) {
          currentEntry.achievements.push(clean);
        }
      }
    }

    if (currentEntry) {
      entries.push(finalizeExperienceEntry(currentEntry));
    }

    return entries;
  }

  function finalizeExperienceEntry(entry) {
    if (entry.achievements.length === 0) {
      entry.achievements = ['Desempeño de funciones especializadas y cumplimiento de objetivos del área.'];
    }
    return entry;
  }

  function parseEducation(text) {
    if (!text) return [];
    const entries = [];
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const degreeRegex = /(?:Ingenier[ií]a|Licenciatura|T[eé]cnico|Maestr[ií]a|Doctorado|Bachillerato|Diploma|Preparatoria|Secundaria|Degree|Bachelor|Master)/i;
    const yearPattern = /\b(19\d{2}|20\d{2})\s*(?:-|–|a|al|to)?\s*(19\d{2}|20\d{2}|actualidad|presente)?\b/i;

    let currentEdu = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const hasDegree = degreeRegex.test(line);

      if (hasDegree) {
        if (currentEdu) entries.push(currentEdu);

        let degree = line;
        let period = '';
        let institution = '';

        if (yearPattern.test(line)) {
          period = line.match(yearPattern)[0].trim();
          degree = line.replace(yearPattern, '').replace(/[|•\(\)]/g, ' ').trim();
        }

        let j = i + 1;
        while (j < lines.length && !degreeRegex.test(lines[j]) && j <= i + 2) {
          const next = lines[j];
          if (yearPattern.test(next) && !period) {
            period = next.match(yearPattern)[0].trim();
          } else if (!institution && next.length < 70) {
            institution = next.replace(yearPattern, '').trim();
          }
          j++;
        }
        i = j - 1;

        currentEdu = {
          degree: degree || 'Educación Superior',
          institution: institution || 'Universidad / Instituto',
          period: period || '2019 - 2024',
          location: 'México',
          gpa: ''
        };
      }
    }

    if (currentEdu) entries.push(currentEdu);
    return entries;
  }

  function parseSkills(text) {
    if (!text) return [];
    const rawTokens = text.split(/[\n,;•\*\t|]+/)
      .map(s => s.trim().replace(/^[-•\*\d\.]+\s*/, ''))
      .filter(s => s.length >= 2 && s.length <= 35 && !/^(habilidades|skills|aptitudes):?$/i.test(s));

    const unique = [...new Set(rawTokens)];

    const skills = [];
    if (unique.length > 0) {
      skills.push({
        category: 'Habilidades Principales',
        items: unique.slice(0, 15)
      });
    }
    return skills;
  }

  function parseLanguages(text) {
    if (!text) return [];
    const list = [];
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    const langMap = {
      'español': 'Español',
      'spanish': 'Español',
      'inglés': 'Inglés',
      'ingles': 'Inglés',
      'english': 'Inglés',
      'francés': 'Francés',
      'frances': 'Francés',
      'french': 'Francés',
      'alemán': 'Alemán',
      'aleman': 'Alemán',
      'german': 'Alemán',
      'portugués': 'Portugués',
      'portugues': 'Portugués',
      'italiano': 'Italiano'
    };

    for (const line of lines) {
      const lower = line.toLowerCase();
      for (const [key, name] of Object.entries(langMap)) {
        if (lower.includes(key)) {
          let level = 'Intermedio';
          if (lower.includes('nativo') || lower.includes('materno') || lower.includes('native')) level = 'Nativo';
          else if (lower.includes('avanzado') || lower.includes('c1') || lower.includes('c2') || lower.includes('advanced')) level = 'Avanzado (C1)';
          else if (lower.includes('b2') || lower.includes('intermedio alto') || lower.includes('upper')) level = 'Intermedio Alto (B2)';
          else if (lower.includes('b1') || lower.includes('intermedio') || lower.includes('intermediate')) level = 'Intermedio (B1)';
          else if (lower.includes('básico') || lower.includes('basico') || lower.includes('a2') || lower.includes('basic')) level = 'Básico (A2)';

          if (!list.some(item => item.name === name)) {
            list.push({ name, level });
          }
        }
      }
    }

    if (list.length === 0) {
      list.push({ name: 'Español', level: 'Nativo' });
    }

    return list;
  }

  function parseCVText(rawText) {
    const text = normalizeText(rawText);
    const trimmed = text.trim();
    if (!trimmed) {
      throw new Error('El texto proporcionado está vacío.');
    }

    // Comprobar si es un JSON (OpenCV Studio o estándar JSON Resume)
    if (trimmed.startsWith('{')) {
      try {
        const parsedJson = JSON.parse(trimmed);
        if (parsedJson.personal && (parsedJson.experience || parsedJson.education)) {
          return parsedJson;
        } else if (parsedJson.basics) {
          return {
            name: parsedJson.basics.name ? `CV - ${parsedJson.basics.name}` : 'CV Importado (JSON)',
            template: 'tech',
            colorTheme: 'navy',
            personal: {
              fullName: parsedJson.basics.name || '',
              headline: parsedJson.basics.label || '',
              email: parsedJson.basics.email || '',
              phone: parsedJson.basics.phone || '',
              location: parsedJson.basics.location?.city || 'México',
              linkedin: (parsedJson.basics.profiles?.find(p => /linkedin/i.test(p.network))?.url) || '',
              github: (parsedJson.basics.profiles?.find(p => /github/i.test(p.network))?.url) || '',
              portfolio: parsedJson.basics.url || '',
              photo: 'assets/default_avatar.svg',
              showPhoto: true
            },
            summary: parsedJson.basics.summary || '',
            experience: (parsedJson.work || []).map(w => ({
              role: w.position || 'Puesto',
              company: w.name || 'Empresa',
              period: `${w.startDate || ''} - ${w.endDate || 'Actualidad'}`.trim(),
              location: w.location || 'México',
              achievements: w.highlights || [w.summary].filter(Boolean)
            })),
            education: (parsedJson.education || []).map(e => ({
              degree: e.studyType ? `${e.studyType} en ${e.area || ''}` : e.area || 'Educación Superior',
              institution: e.institution || 'Universidad',
              period: `${e.startDate || ''} - ${e.endDate || ''}`.trim(),
              location: 'México',
              gpa: e.score || ''
            })),
            skills: (parsedJson.skills || []).map(s => ({
              category: s.name || 'Competencias',
              items: s.keywords || []
            })),
            languages: (parsedJson.languages || []).map(l => ({
              name: l.language || 'Idioma',
              level: l.fluency || 'Intermedio'
            })),
            projects: (parsedJson.projects || []).map(p => ({
              name: p.name || 'Proyecto',
              role: 'Desarrollador',
              period: '',
              link: p.url || '',
              bullets: p.highlights || [p.description].filter(Boolean)
            })),
            kpis: []
          };
        }
      } catch (e) {
        // Continuar como texto no estructurado
      }
    }

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    const contact = extractContact(text);
    const { fullName, headline } = extractNameAndHeadline(lines, contact);
    const sections = segmentSections(text);

    const experience = parseExperience(sections.experience);
    const education = parseEducation(sections.education);
    const skills = parseSkills(sections.skills);
    const languages = parseLanguages(sections.languages);

    let summary = sections.summary ? sections.summary.replace(/^(perfil|resumen|acerca de mí)[:\s-]*/i, '').trim() : '';
    if (!summary && lines.length > 2) {
      for (const line of lines.slice(1, 6)) {
        if (line.length > 50 && !line.includes('@')) {
          summary = line;
          break;
        }
      }
    }
    if (!summary) {
      summary = `${headline || 'Profesional'} con sólida formación y experiencia orientada al cumplimiento de objetivos de alto impacto y mejora continua.`;
    }

    const generatedProfile = {
      name: fullName ? `CV - ${fullName}` : 'CV Importado',
      template: 'tech',
      colorTheme: 'navy',
      personal: {
        fullName: fullName || 'Nombre del Profesional',
        headline: headline || 'Especialista en su Área',
        email: contact.email || 'contacto@ejemplo.com',
        phone: contact.phone || '(55) 1234 5678',
        location: contact.location || 'México',
        linkedin: contact.linkedin || '',
        github: contact.github || '',
        portfolio: contact.website || '',
        photo: 'assets/default_avatar.svg',
        showPhoto: true
      },
      summary: summary,
      experience: experience.length > 0 ? experience : [
        {
          role: headline || 'Puesto o Especialidad',
          company: 'Empresa Principal',
          period: '2022 - Actualidad',
          location: contact.location || 'México',
          achievements: [
            'Gestión de actividades operativas y entrega de proyectos con altos estándares de calidad.',
            'Optimización de procesos internos y colaboración con equipos multidisciplinarios.'
          ]
        }
      ],
      education: education.length > 0 ? education : [
        {
          degree: 'Formación Profesional / Universitaria',
          institution: 'Universidad o Instituto Tecnológico',
          period: '2019 - 2024',
          location: contact.location || 'México',
          gpa: ''
        }
      ],
      skills: skills.length > 0 ? skills : [
        {
          category: 'Competencias Técnicas',
          items: ['Resolución de Problemas', 'Trabajo en Equipo', 'Adaptabilidad', 'Liderazgo']
        }
      ],
      languages: languages,
      projects: [],
      kpis: [
        { label: 'Proyectos Entregados', value: '10+', subtext: 'A tiempo' },
        { label: 'Eficacia Operativa', value: '98%', subtext: 'Calidad' }
      ]
    };

    return generatedProfile;
  }

  return {
    parseCVText,
    normalizeText,
    segmentSections,
    parseExperience,
    parseEducation,
    parseSkills,
    parseLanguages,
    extractContact
  };

})();
