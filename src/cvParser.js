/**
 * OpenCV Studio - cvParser.js
 * Motor Heurístico Inteligente para Extracción y Análisis de Currículums
 * Permite transformar texto plano no estructurado (copiado de PDF, Word, LinkedIn, TXT
 * o extraído mediante OCR de documentos aplanados) en un perfil estructurado y listo para el editor.
 */

window.cvParser = (function() {
  'use strict';

  function normalizeText(text) {
    if (!text) return '';
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      // Limpiar encabezados y pies de página de impresión de navegadores (Chrome / Edge / Safari)
      .replace(/^\s*\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}:\d{2}.*$/gm, '')
      .replace(/^.*(?:file:\/\/|https?:\/\/).*$/gm, '')
      .replace(/^---\s*P[AÁ]GINA\s*\d+\s*---$/gim, '')
      .replace(/^--\s*\d+\s*of\s*\d+\s*--$/gim, '')
      // Corregir artefactos comunes de OCR (ampersand, caracteres especiales de código)
      .replace(/\b8\.?\b(?=\s+[A-Za-z])/g, '&')
      .replace(/\s+£\s+/g, ' & ')
      .replace(/Ch\+\+/gi, 'C++')
      .replace(/Ch\+/gi, 'C++')
      // Corregir lectura de OCR en arrobas de correo electrónico (e.g. eagmail.com -> @gmail.com)
      .replace(/([a-zA-Z0-9._%+-]+)\s*eagmail\.com\b/gi, '$1@gmail.com')
      .replace(/([a-zA-Z0-9._%+-]+)\s*©gmail\.com\b/gi, '$1@gmail.com')
      .replace(/([a-zA-Z0-9._%+-]+)\s*@\s*([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '$1@$2');
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

    // 2. Teléfono / WhatsApp (mínimo 8 dígitos numéricos)
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

    // 5. Portafolio / Web externa
    const urlMatch = text.match(/https?:\/\/(?!www\.linkedin|linkedin|github)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s]*/i);
    if (urlMatch) {
      contact.website = urlMatch[0].trim();
    }

    // 6. Ubicación (limpiando emails, teléfonos y enlaces que puedan estar en la misma línea)
    const locationKeywords = /(?:Jalisco|Guadalajara|CDMX|Ciudad de M[eé]xico|Zapopan|Tepatitl[aán]|Monterrey|Puebla|Quer[eé]taro|Tijuana|M[eé]xico|Leon|Toluca|Chihuahua|M[eé]rida|Arandas)/i;
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines.slice(0, 25)) {
      if (locationKeywords.test(line) && !line.toLowerCase().includes('experiencia') && !line.toLowerCase().includes('educación')) {
        let loc = line
          .replace(contact.email, '')
          .replace(contact.phone, '')
          .replace(/linkedin\.com\/\S+/g, '')
          .replace(/https?:\/\/\S+/g, '')
          .replace(/^[•\-\*»\d\s]+/g, '')
          .trim();
        if (loc.length > 2 && loc.length < 60) {
          contact.location = loc;
          break;
        }
      }
    }

    return contact;
  }

  function extractNameAndHeadline(lines, contact, rawText) {
    let fullName = '';
    let headline = '';

    // 1. Si el documento tiene título de página de Chrome/Edge: "CV <Nombre> - <Titular>"
    const headerMatch = (rawText || '').match(/(?:^|\n)(?:\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}:\d{2}\s+)?CV\s+([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)\s*[-–|]\s*([^\n]+)/i);
    if (headerMatch) {
      fullName = headerMatch[1].trim();
      headline = headerMatch[2].replace(/\s*[8£]\.?\s*/g, ' & ').trim();
    }

    const reservedHeaders = /^(curriculum|curriculum vitae|resume|hoja de vida|cv|datos personales|contacto|perfil|experiencia|educación|stack)$/i;

    if (!fullName) {
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
    }

    if (!headline) {
      const headlineRegex = /(?:Ingenier[oa]|Desarrollador[a]|Licenciad[oa]|Analista|Programador[a]|Especialista|Consultor|T[eé]cnico|Developer|Engineer|Architect)[^\n,.]*/i;
      for (let i = 0; i < Math.min(lines.length, 12); i++) {
        const match = lines[i].match(headlineRegex);
        if (match && lines[i] !== fullName) {
          headline = match[0].replace(/\s*[8£]\.?\s*/g, ' & ').trim();
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
      { key: 'summary', regex: /(?:^|\b)(?:perfil(?:\s+profesional|\s+laboral)?|resumen(?:\s+ejecutivo|\s+profesional)?|s[ií]ntesis(?:\s+profesional|\s+curricular|\s+laboral)?|acerca\s+de\s+m[ií]|sobre\s+m[ií]|summary|about\s+me|profile|objetivo(?:\s+profesional)?)\b/i },
      { key: 'experience', regex: /(?:^|\b)(?:experiencia(?:\s+laboral|\s+profesional)?|trayectoria(?:\s+laboral)?|historial\s+laboral|work\s+experience|employment\s+history|experience)\b/i },
      { key: 'education', regex: /(?:^|\b)(?:educaci[oó]n|formaci[oó]n(?:\s+acad[eé]mica)?|estudios|academic\s+background|education)\b/i },
      { key: 'skills', regex: /(?:^|\b)(?:habilidades(?:\s+t[eé]cnicas)?|aptitudes|skills|competencias(?:\s+clave)?|tecnolog[ií]as|herramientas|stack(?:\s+t[eé]cnico)?|lenguajes\s+y\s+automatizaci[oó]n)\b/i },
      { key: 'languages', regex: /(?:^|\b)(?:idiomas(?:\s+extranjeros)?|languages|spoken\s+languages)\b/i },
      { key: 'projects', regex: /(?:^|\b)(?:proyectos(?:\s+destacados|\s+t[eé]cnicos)?|projects|portfolio|proyectos\s+personales)\b/i },
      { key: 'certifications', regex: /(?:^|\b)(?:certificaciones|cursos|certificados|certifications|cursos\s+y\s+certificaciones)\b/i }
    ];

    const lines = rawText.split('\n');
    let currentKey = '_header';
    const contentAccumulator = { _header: [] };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Limpiar posibles íconos o glifos OCR iniciales como +, <>, dh, OQ, 2, El
      const cleanHeaderLine = line
        .replace(/^[^a-zA-ZáéíóúÁÉÍÓÚñÑ]+/, '')
        .replace(/^[a-zA-Z]{1,2}\s+(?=[A-ZÁÉÍÓÚÑ])/, '')
        .replace(/[:\-#=]+$/, '')
        .trim();

      if (cleanHeaderLine.length < 50) {
        const matched = sectionRegexes.find(s => s.regex.test(cleanHeaderLine));
        if (matched) {
          currentKey = matched.key;
          if (!contentAccumulator[currentKey]) contentAccumulator[currentKey] = [];
          continue;
        }
      }

      if (!contentAccumulator[currentKey]) contentAccumulator[currentKey] = [];
      contentAccumulator[currentKey].push(line);
    }

    for (const key in contentAccumulator) {
      if (key !== '_header') {
        sections[key] = contentAccumulator[key].join('\n');
      }
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
      const isBullet = /^[»•\-\*\d\.\)]+\s*/.test(line);

      if (hasDate && !isBullet) {
        if (currentEntry) entries.push(finalizeExperienceEntry(currentEntry));

        const dateMatch = line.match(datePattern);
        const period = dateMatch ? dateMatch[0].trim() : '';
        const titlePart = line.replace(datePattern, '').replace(/\([^\)]*\)/g, '').replace(/[|•]/g, ' ').trim();

        let role = titlePart;
        let company = '';
        if (titlePart.includes(' - ') || titlePart.includes(' | ')) {
          const parts = titlePart.split(/\s*[-|]\s*/);
          role = parts[0];
          company = parts.slice(1).join(' - ');
        }

        // Si la siguiente línea es la empresa (ej. Anguiplast | Industria...)
        if (i + 1 < rawLines.length && !/^[»•\-\*]/.test(rawLines[i + 1]) && !datePattern.test(rawLines[i + 1])) {
          const nextLine = rawLines[i + 1];
          if (nextLine.length < 80) {
            company = nextLine.split(/\s*[-|]\s*/)[0].trim();
            i++;
          }
        }

        currentEntry = {
          role: role || 'Especialista',
          company: company || 'Empresa',
          period: period,
          location: 'México',
          bullets: [],
          achievements: []
        };
      } else if (currentEntry && isBullet) {
        const clean = line.replace(/^[»•\-\*\d\.\)]+\s*/, '').trim();
        if (clean.length > 5) {
          currentEntry.bullets.push(clean);
          currentEntry.achievements.push(clean);
        }
      } else if (currentEntry && currentEntry.bullets && currentEntry.bullets.length > 0) {
        // Línea de continuación del bullet previo
        currentEntry.bullets[currentEntry.bullets.length - 1] += ' ' + line;
        currentEntry.achievements[currentEntry.achievements.length - 1] += ' ' + line;
      }
    }

    if (currentEntry) {
      entries.push(finalizeExperienceEntry(currentEntry));
    }

    return entries;
  }

  function finalizeExperienceEntry(entry) {
    const list = (entry.bullets && entry.bullets.length > 0) ? entry.bullets : (entry.achievements || []);
    if (list.length === 0) {
      list.push('Desempeño de funciones especializadas y cumplimiento de objetivos del área.');
    }
    entry.bullets = list;
    entry.achievements = list;
    return entry;
  }

  function parseEducation(text) {
    if (!text) return [];
    const entries = [];
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const degreeRegex = /(?:Ingenier[ií]a|Licenciatura|T[eé]cnico|Maestr[ií]a|Doctorado|Bachillerato|Diploma|Preparatoria|Secundaria|Degree|Bachelor|Master)/i;
    const yearPattern = /\b(19\d{2}|20\d{2})\s*(?:-|–|a|al|to|\/)?\s*(19\d{2}|20\d{2}|actualidad|presente)?\b/i;

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
        while (j < lines.length && !degreeRegex.test(lines[j]) && j <= i + 3) {
          const next = lines[j];
          if (yearPattern.test(next) && !period) {
            period = next.match(yearPattern)[0].trim();
          } else if (!institution && next.length < 80) {
            institution = next.replace(yearPattern, '').replace(/[|•]/g, ' ').trim();
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
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const categories = [];
    let currentCat = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Encabezados de categorías de habilidades (e.g. LENGUAJES & AUTOMATIZACIÓN, BASES DE DATOS, etc.)
      const isHeader = /^[A-ZÁÉÍÓÚÑ\s&/¿£8+\-]{3,35}$/.test(line) && !line.includes('(') && !line.includes('.');
      if (isHeader) {
        if (currentCat && currentCat.items.length > 0) {
          categories.push(currentCat);
        }
        currentCat = {
          category: line.replace(/\s*[8£¿]\s*/g, ' & ').trim(),
          items: []
        };
      } else {
        const items = line.split(/[\/,;•\*|»]+/)
          .map(t => t.trim())
          .filter(t => t.length >= 2 && t.length <= 40);

        if (!currentCat) {
          currentCat = { category: 'Habilidades & Tecnologías', items: [] };
        }
        currentCat.items.push(...items);
      }
    }

    if (currentCat && currentCat.items.length > 0) {
      categories.push(currentCat);
    }

    // Si no hubo categorías estructuradas, tomar tokens generales
    if (categories.length === 0) {
      const rawTokens = text.split(/[\n,;•\*\t|»]+/)
        .map(s => s.trim().replace(/^[-•\*\d\.]+\s*/, ''))
        .filter(s => s.length >= 2 && s.length <= 35 && !/^(habilidades|skills|aptitudes|stack):?$/i.test(s));

      const unique = [...new Set(rawTokens)];
      if (unique.length > 0) {
        categories.push({
          category: 'Habilidades Principales',
          items: unique.slice(0, 16)
        });
      }
    }

    return categories;
  }

  function parseProjects(text) {
    if (!text) return [];
    const projects = [];
    const projLines = text.split('\n').map(l => l.trim()).filter(Boolean);
    for (let i = 0; i < projLines.length; i++) {
      const line = projLines[i];
      if (line.length > 5 && line.length < 90) {
        const projName = line.replace(/\s*(?:VBA|Java|MySQL|SQL|NetBeans|\+).*$/i, '').trim();
        const desc = projLines[i + 1] && projLines[i + 1].length > 20 ? projLines[i + 1] : '';
        if (projName) {
          projects.push({
            name: projName,
            role: 'Desarrollador',
            period: '',
            link: '',
            bullets: desc ? [desc] : ['Diseño e implementación de solución técnica.']
          });
          if (desc) i++;
        }
      }
    }
    return projects;
  }

  function parseLanguages(text) {
    if (!text) return [{ name: 'Español', level: 'Nativo' }];
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
    const { fullName, headline } = extractNameAndHeadline(lines, contact, rawText);
    const sections = segmentSections(text);

    const experience = parseExperience(sections.experience);
    const education = parseEducation(sections.education);
    const skills = parseSkills(sections.skills);
    const languages = parseLanguages(sections.languages);
    const projects = parseProjects(sections.projects);

    let summary = sections.summary ? sections.summary.replace(/^(perfil|resumen|acerca de mí)[:\s-]*/i, '').trim() : '';
    if (!summary || summary.length < 35) {
      for (const line of lines) {
        if (line.length > 70 && !line.includes('@') && !line.startsWith('http')) {
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
      experience: (experience.length > 0 ? experience : [
        {
          role: headline || 'Puesto o Especialidad',
          company: 'Empresa Principal',
          period: '2022 - Actualidad',
          location: contact.location || 'México',
          bullets: [
            'Gestión de actividades operativas y entrega de proyectos con altos estándares de calidad.',
            'Optimización de procesos internos y colaboración con equipos multidisciplinarios.'
          ],
          achievements: [
            'Gestión de actividades operativas y entrega de proyectos con altos estándares de calidad.',
            'Optimización de procesos internos y colaboración con equipos multidisciplinarios.'
          ]
        }
      ]).map(e => {
        const b = Array.isArray(e.bullets) && e.bullets.length > 0 ? e.bullets : (Array.isArray(e.achievements) ? e.achievements : []);
        return { ...e, bullets: b, achievements: b };
      }),
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
      projects: (projects || []).map(pr => ({
        id: 'proj_' + Math.random().toString(36).substr(2, 9),
        title: pr.title || pr.name || 'Proyecto Técnico',
        name: pr.name || pr.title || 'Proyecto Técnico',
        tech: pr.tech || 'Tecnologías aplicadas',
        link: pr.link || '',
        description: pr.description || (Array.isArray(pr.bullets) ? pr.bullets.join(' ') : '') || 'Diseño y ejecución de solución técnica especializada.'
      })),
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
    parseProjects,
    extractContact
  };

})();
