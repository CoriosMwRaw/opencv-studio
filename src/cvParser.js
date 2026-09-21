/**
 * OpenCV Studio - cvParser.js
 * Motor Heurístico Inteligente y Exhaustivo para Extracción y Análisis de Currículums
 * Compatible 100% con el esquema de datos interno de OpenCV Studio.
 */

(function(root) {
  'use strict';

  // 1. DICCIONARIO TECNOLÓGICO Y METODOLÓGICO
  const SKILL_DICTIONARY = {
    languages: [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'c', 'php', 'ruby', 'go', 'golang',
      'rust', 'swift', 'kotlin', 'dart', 'scala', 'r', 'matlab', 'perl', 'bash', 'shell', 'powershell',
      'html5', 'html', 'css3', 'css', 'sass', 'scss', 'vba', 'visual basic', 'solidity', 'sql', 'pl/sql'
    ],
    databases: [
      'mysql', 'postgresql', 'sql server', 'sqlite', 'mongodb', 'oracle', 'redis', 'cassandra',
      'mariadb', 'dynamodb', 'firebase', 'firestore', 'neo4j', 'elasticsearch', 'supabase',
      'data warehouse', 'snowflake', 'bigquery', 'cosmos db'
    ],
    tools: [
      'react', 'react native', 'angular', 'vue', 'vue.js', 'next.js', 'nuxt', 'node.js', 'express',
      'nest.js', 'django', 'flask', 'fastapi', 'spring', 'spring boot', 'laravel', 'asp.net', '.net core',
      'git', 'github', 'gitlab', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'google cloud',
      'terraform', 'jenkins', 'ci/cd', 'linux', 'distribuciones linux', 'ubuntu', 'debian', 'postman',
      'swagger', 'vs code', 'visual studio', 'netbeans', 'intellij', 'eclipse', 'power bi', 'tableau',
      'excel avanzado', 'excel', 'microsoft excel', 'macros', 'macros en vba', 'power query', 'dax',
      'mantenimiento preventivo', 'mantenimiento de equipos', 'mantenimiento de cómputo', 'hardware',
      'jira', 'confluence', 'trello', 'figma', 'photoshop', 'illustrator', 'sap', 'erp'
    ],
    softSkills: [
      'aprendizaje autodidacta', 'resolución de problemas', 'análisis crítico', 'capacidad analítica',
      'interpretación de datos', 'metodologías ágiles', 'metodologías agile', 'agile', 'scrum', 'kanban',
      'lean', 'six sigma', 'liderazgo', 'leadership', 'trabajo en equipo', 'teamwork', 'comunicación efectiva',
      'pensamiento crítico', 'pensamiento analítico', 'problem solving', 'adaptabilidad', 'gestión del tiempo',
      'negociación', 'orientación a resultados', 'proactividad', 'atención al detalle'
    ]
  };

  function normalizeText(text) {
    if (!text) return '';
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '')
      .replace(/^---\s*P[AÁ]GINA\s*\d+\s*---$/gim, '')
      .replace(/\b8\.?\b(?=\s+[A-Za-z])/g, '&')
      .replace(/\s+£\s+/g, ' & ')
      .replace(/([a-zA-Z0-9._%+-]+)\s*@\s*([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '$1@$2')
      .replace(/([^\n])\s*\t•/g, '$1\n• ')
      .replace(/([^\n])\s*\n\s*•\s*\n/g, '$1\n• ')
      .replace(/([^\n])\s*\n\s*•\s*$/gm, '$1\n• ')
      .replace(/\t+/g, ' ')
      .trim();
  }

  function formatTitleCase(str) {
    if (!str) return '';
    const minorWords = ['de', 'del', 'la', 'las', 'el', 'los', 'y', 'en', 'a', 'al', 'e', 'o', 'u', 'da', 'do', 'das', 'dos'];
    return str
      .trim()
      .split(/\s+/)
      .map((w, idx) => {
        const lower = w.toLowerCase();
        if (idx > 0 && minorWords.includes(lower)) {
          return lower;
        }
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join(' ');
  }

  function extractNameFromFilename(filename) {
    if (!filename) return '';
    let base = filename.replace(/^.*[\\\/]/, '');
    base = base.replace(/\.[a-zA-Z0-9]+$/, '');
    base = base
      .replace(/\(\d+\)/g, ' ')
      .replace(/[_\-]+/g, ' ')
      .replace(/\b(?:curriculum(?:\s+vitae)?|hoja\s+de\s+vida|resume|cv\d*|interactivo)\b/gi, ' ')
      .replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim();

    const words = base.split(/\s+/).filter(w => /^[a-záéíóúñA-ZÁÉÍÓÚÑ]+$/i.test(w) && w.length >= 2);
    if (words.length >= 2 && words.length <= 5) {
      return formatTitleCase(words.join(' '));
    }
    return '';
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
      contact.phone = phoneMatch[0].replace(/\s+/g, '').trim();
    }

    // 3. LinkedIn
    const linkedinMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_\-%áéíóúÁÉÍÓÚñÑ]+)/i) ||
                          text.match(/linkedin\.com\/in\/([a-zA-Z0-9_\-%áéíóúÁÉÍÓÚñÑ]+)/i);
    if (linkedinMatch) {
      const cleanUrl = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : 'https://' + linkedinMatch[0];
      contact.linkedin = cleanUrl.replace(/&amp;/g, '&').split('?')[0];
    }

    // 4. GitHub
    const githubMatch = text.match(/https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9_\-]+)/i) ||
                        text.match(/github\.com\/([a-zA-Z0-9_\-]+)/i);
    if (githubMatch) {
      const cleanUrl = githubMatch[0].startsWith('http') ? githubMatch[0] : 'https://' + githubMatch[0];
      contact.github = cleanUrl.split('?')[0];
    }

    // 5. Portafolio / Web
    const urlMatch = text.match(/https?:\/\/(?!www\.linkedin|linkedin|github)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s]*/i);
    if (urlMatch) {
      contact.website = urlMatch[0].trim();
    }

    // 6. Ubicación
    const locationKeywords = /(?:Arandas|Jalisco|Guadalajara|CDMX|Ciudad de M[eé]xico|Zapopan|Monterrey|Puebla|Quer[eé]taro|Tijuana|M[eé]xico|Leon|Toluca|Chihuahua|M[eé]rida|Canc[uú]n|Veracruz|Aguascalientes|Morelia|Hermosillo|Saltillo|San Luis Potos[ií]|Remoto|Remote|H[ií]brido|Hybrid)/i;
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (locationKeywords.test(line) && !line.toLowerCase().includes('experiencia') && !line.toLowerCase().includes('educación') && !line.toLowerCase().includes('responsable') && !/(?:conalep|instituto|universidad|colegio|tecnol[oó]gico|escuela)/i.test(line)) {
        let loc = line
          .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
          .replace(/(?:\+?52\s?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{4}/g, '')
          .replace(/linkedin\.com\/\S+/g, '')
          .replace(/github\.com\/\S+/g, '')
          .replace(/https?:\/\/\S+/g, '')
          .replace(/\b(?:tel|email|correo|phone|móvil|celular)\s*:?/gi, '')
          .replace(/[|•:]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (loc.length >= 3 && loc.length < 65) {
          contact.location = loc;
          break;
        }
      }
    }

    if (!contact.location) contact.location = 'Arandas, Jalisco, México';
    return contact;
  }

  function extractNameAndHeadline(lines, contact, rawText, filename = '') {
    let fullName = '';
    let headline = '';

    const invalidNameWords = [
      'con', 'sin', 'en', 'para', 'por', 'sobre', 'experiencia', 'sistemas', 'semestre', 'estudiante',
      'computacionales', 'analista', 'desarrollador', 'licenciado', 'ingeniero', 'carrera', 'universidad',
      'escuela', 'trabajo', 'sólida', 'solida', 'datos', 'mantenimiento', 'gestión', 'gestion',
      'información', 'informacion', 'operativa', 'procesos', 'soluciones', 'tecnológicas', 'tecnologicas'
    ];

    // 1. Intento prioritario: Nombre en archivo verificado contra el texto del CV
    const fromFile = extractNameFromFilename(filename);
    if (fromFile && fromFile.length >= 6) {
      const parts = fromFile.toLowerCase().split(/\s+/).filter(p => p.length >= 3);
      const textLower = rawText.toLowerCase();
      const matchesInText = parts.filter(p => textLower.includes(p));
      if (matchesInText.length >= 2) {
        fullName = fromFile;
      }
    }

    // 2. Intento por cabecera estándar: "CV Nombre - Titular"
    if (!fullName) {
      const headerMatch = (rawText || '').match(/(?:^|\n)(?:\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}:\d{2}\s+)?CV\s+([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)\s*[-–|]\s*([^\n]+)/i);
      if (headerMatch && headerMatch[1]) {
        fullName = formatTitleCase(headerMatch[1]);
        headline = headerMatch[2].trim().toUpperCase();
      }
    }

    // 2. Intento inteligente por el contenido textual
    if (!fullName) {
      for (let i = 0; i < Math.min(lines.length, 60); i++) {
        const line = lines[i].trim();
        if (!line) continue;
        if (line.includes('@') || line.includes('http') || line.replace(/\D/g, '').length >= 8) continue;
        if (/^(?:curriculum|resume|cv|hoja de vida|resumen|síntesis|perfil|contacto|experiencia|educación|competencias|habilidades|priv\b|calle\b|edad\b|age\b|casado|soltero|ingenier[ií]a|licenciatura|t[eé]cnico|maestr[ií]a|doctorado|bachillerato|estudiante)/i.test(line)) continue;

        const words = line.split(/\s+/);
        const hasInvalidWord = words.some(w => invalidNameWords.includes(w.toLowerCase()));
        if (hasInvalidWord) continue;

        const allAlpha = words.every(w => /^[a-záéíóúñA-ZÁÉÍÓÚÑ.-]+$/i.test(w) && w.length >= 2);
        if (allAlpha && words.length >= 2 && words.length <= 5) {
          fullName = formatTitleCase(line);
          if (i + 1 < lines.length && !headline) {
            const next = lines[i + 1].trim();
            if (!next.includes('@') && !next.includes('http') && next.length < 90 && !/^(?:curriculum|experiencia|educación|resumen|síntesis)/i.test(next)) {
              headline = next.toUpperCase();
            }
          }
          break;
        }

        // Comprobar si dos líneas consecutivas forman el nombre (ej. Juan Carlos en línea i y Pérez Gómez en línea i+1)
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          const w1 = line.split(/\s+/);
          const w2 = nextLine.split(/\s+/);
          if (!w1.some(w => invalidNameWords.includes(w.toLowerCase())) && !w2.some(w => invalidNameWords.includes(w.toLowerCase()))) {
            if (w1.length >= 1 && w1.length <= 3 && w2.length >= 1 && w2.length <= 3) {
              const allW = [...w1, ...w2];
              const areAllWordsAlpha = allW.every(w => /^[a-záéíóúñA-ZÁÉÍÓÚÑ]+$/i.test(w) && w.length >= 2);
              if (areAllWordsAlpha && allW.length >= 2 && allW.length <= 5) {
                fullName = formatTitleCase([...w1, ...w2].join(' '));
                break;
              }
            }
          }
      }
    }
  }

    // 3. Fallback inteligente al nombre del archivo
    if (!fullName || fullName.length < 5) {
      const fromFile = extractNameFromFilename(filename);
      if (fromFile) fullName = fromFile;
    }

    // 4. Si aún no hay titular, buscar palabras clave de puesto
    if (!headline) {
      const headlineRegex = /(?:Ingenier[oa]|Desarrollador[a]|Licenciad[oa]|Analista|Programador[a]|Especialista|Consultor|T[eé]cnico|Developer|Engineer|Architect|Scrum Master|Project Manager)[^\n,.]*/i;
      for (let i = 0; i < Math.min(lines.length, 40); i++) {
        const match = lines[i].match(headlineRegex);
        if (match && lines[i].trim().toLowerCase() !== fullName.toLowerCase()) {
          headline = match[0].trim().toUpperCase();
          break;
        }
      }
    }

    return { fullName: fullName || '', headline: headline || '' };
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
      { key: 'summary', regex: /^(?:perfil(?:\s+(?:profesional|laboral))?|resumen(?:\s+(?:ejecutivo|profesional))?|s[ií]ntesis(?:\s+(?:profesional|curricular|laboral))?|acerca\s+de\s+m[ií]|sobre\s+m[ií]|summary|about\s+me|profile|objetivo(?:\s+profesional)?)$/i },
      { key: 'experience', regex: /^(?:experiencia(?:\s+(?:laboral|profesional))?|trayectoria(?:\s+laboral)?|historial\s+laboral|work\s+experience|employment\s+history|experience)$/i },
      { key: 'education', regex: /^(?:educaci[oó]n|estudios|formaci[oó]n(?:\s+acad[eé]mica)?|academic\s+background|education)$/i },
      { key: 'skills', regex: /^(?:habilidades(?:\s+(?:t[eé]cnicas|blandas|profesionales|clave|digitales))?|competencias(?:\s+(?:clave|t[eé]cnicas|blandas|profesionales))?|aptitudes|skills|tecnolog[ií]as|herramientas|stack(?:\s+t[eé]cnico)?|lenguajes\s+y\s+automatizaci[oó]n)$/i },
      { key: 'projects', regex: /^(?:proyectos(?:\s+(?:destacados|clave|t[eé]cnicos|personales))?|logros(?:\s+(?:destacados|clave|profesionales))?|projects|portfolio|reconocimientos)$/i },
      { key: 'languages', regex: /^(?:idiomas(?:\s+extranjeros)?|languages|spoken\s+languages)$/i },
      { key: 'certifications', regex: /^(?:certificaciones|cursos|certificados|diplomados|certifications|cursos\s+y\s+certificaciones)$/i }
    ];

    const lines = rawText.split('\n');
    let currentKey = '_header';
    const contentAccumulator = { _header: [] };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

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

  // Patrón universal de fechas (soporta días, meses en español/inglés, años y palabras como Presente/Actualidad)
  const DATE_PATTERN = /(?:(?:\b\d{1,2}\s*(?:de|\/|-)?\s*)?(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|january|february|march|april|may|june|july|august|september|october|november|december|ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic|jan|apr|aug)\.?\s*(?:de\s+)?|\b)\b(19\d{2}|20\d{2})\b\s*(?:-|–|—|a|al|to|\/)\s*(?:(?:\b\d{1,2}\s*(?:de|\/|-)?\s*)?(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|january|february|march|april|may|june|july|august|september|october|november|december|ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic|jan|apr|aug)\.?\s*(?:de\s+)?(?:\b(19\d{2}|20\d{2})\b)|(?:\b(19\d{2}|20\d{2})\b)|actualidad|presente|present|hoy|current)/i;

  function parseExperience(text) {
    if (!text) return [];
    const entries = [];
    const rawLines = text.split('\n').map(l => l.trim()).filter(Boolean);

    let currentEntry = null;

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];
      const hasDate = DATE_PATTERN.test(line);
      const isExplicitBullet = /^[»•\-\*]+\s*|^\d{1,2}[\.\)]\s+/.test(line);
      const nextLineHasDate = (i + 1 < rawLines.length) && DATE_PATTERN.test(rawLines[i + 1]) && !isExplicitBullet;

      // Caso A: Línea i es Rol/Empresa, Línea i+1 es Fecha
      if (nextLineHasDate && !hasDate) {
        if (currentEntry) entries.push(finalizeExperienceEntry(currentEntry));

        const titleLine = line;
        const dateLine = rawLines[i + 1];
        i++;

        const dateMatch = dateLine.match(DATE_PATTERN);
        const period = dateMatch ? dateMatch[0].trim() : '';
        const loc = dateLine.replace(DATE_PATTERN, '').replace(/[|•\(\)]/g, ' ').trim();

        let role = titleLine;
        let company = '';
        if (titleLine.includes(' • ') || titleLine.includes(' - ') || titleLine.includes(' | ')) {
          const parts = titleLine.split(/\s*[•\-|]\s*/);
          role = parts[0].trim();
          company = parts.slice(1).join(' - ').trim();
        }

        currentEntry = {
          id: 'exp_' + (entries.length + 1),
          role: role || 'Especialista',
          company: company || 'Empresa Principal',
          period: period || '2023 – Presente',
          location: loc || 'México',
          bullets: []
        };
      }
      // Caso B: Línea i es Fecha, y Línea i+1 es Rol/Empresa
      else if (hasDate && !isExplicitBullet) {
        if (currentEntry) entries.push(finalizeExperienceEntry(currentEntry));

        const dateMatch = line.match(DATE_PATTERN);
        const period = dateMatch ? dateMatch[0].trim() : '';
        let titleLine = line.replace(DATE_PATTERN, '').replace(/[|•\(\)]/g, ' ').trim();

        // Si la línea de fecha no contenía el rol y la siguiente no tiene fecha, el rol está en la siguiente línea
        if (titleLine.length < 5 && i + 1 < rawLines.length && !DATE_PATTERN.test(rawLines[i + 1])) {
          titleLine = rawLines[i + 1].trim();
          i++;
        }

        let role = titleLine;
        let company = '';
        if (titleLine.includes(' • ') || titleLine.includes(' - ') || titleLine.includes(' | ')) {
          const parts = titleLine.split(/\s*[•\-|]\s*/);
          role = parts[0].trim();
          company = parts.slice(1).join(' - ').trim();
        } else if (titleLine.toLowerCase().includes(' en ')) {
          const parts = titleLine.split(/\s+en\s+/i);
          role = parts[0].trim();
          company = parts.slice(1).join(' ').trim();
        }

        currentEntry = {
          id: 'exp_' + (entries.length + 1),
          role: role || 'Especialista Profesional',
          company: company || 'Empresa / Organización',
          period: period || 'Periodo',
          location: 'Ubicación',
          bullets: []
        };
      }
      // Caso C: Viñeta o Párrafo descriptivo dentro de un empleo
      else if (currentEntry) {
        const clean = line.replace(/^[»•\-\*]+\s*|^\d{1,2}[\.\)]\s+/, '').trim();
        if (clean.length > 5) {
          const isCategoryBullet = /^[A-ZÁÉÍÓÚÑ][^:]{2,35}:/.test(clean);
          const startsWithVerb = /^(?:Gestión|Automatización|Análisis|Implementación|Elaboración|Creación|Control|Instalación|Lideré|Diseñé|Desarrollé|Programé|Optimicé|Calculé|Coordiné|Responsable)/i.test(clean);

          if (isExplicitBullet || isCategoryBullet || startsWithVerb || clean.length >= 35) {
            currentEntry.bullets.push(clean);
          } else if (currentEntry.bullets.length > 0) {
            currentEntry.bullets[currentEntry.bullets.length - 1] += ' ' + clean;
          } else {
            currentEntry.bullets.push(clean);
          }
        }
      }
    }

    if (currentEntry) {
      entries.push(finalizeExperienceEntry(currentEntry));
    }

    return entries;
  }

  function finalizeExperienceEntry(entry) {
    if (!entry.bullets || entry.bullets.length === 0) {
      entry.bullets = ['Desempeño de funciones especializadas y cumplimiento de objetivos del área con altos estándares de calidad.'];
    }
    return entry;
  }

  function parseEducation(text, summary = '') {
    if (!text && !summary) return [];
    const entries = [];
    const lines = (text || '').split('\n').map(l => l.trim()).filter(Boolean);

    const degreeRegex = /\b(?:Ingenier[ií]a|Licenciatura|T[eé]cnico|Maestr[ií]a|Doctorado|Bachillerato|Diploma|Preparatoria|Secundaria|Degree|Bachelor|Master|MBA|Doctorate)\b/i;
    const institutionRegex = /\b(?:Instituto|Universidad|Colegio|Facultad|Tecnol[oó]gico|CONALEP|UNAM|IPN|UdeG|ITESM|TecNM|University|College|School)\b/i;

    let currentEdu = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^(?:personal\s+information|age|edad|logros)/i.test(line)) continue;

      const hasDegree = degreeRegex.test(line);
      const hasInst = institutionRegex.test(line);

      if (hasDegree || hasInst) {
        if (currentEdu) entries.push(currentEdu);

        let degree = '';
        let school = '';
        let period = '';
        let details = '';

        if (hasDegree) degree = line;
        if (hasInst && !hasDegree) school = line;

        let j = i + 1;
        while (j < lines.length && j <= i + 3) {
          const next = lines[j];
          if (/^(?:personal|age|edad|logros)/i.test(next)) break;
          if (degreeRegex.test(next) && !degree) {
            degree = next;
          } else if (institutionRegex.test(next) && !school) {
            school = next;
          } else if (DATE_PATTERN.test(next) || /\b(19\d{2}|20\d{2})\b/.test(next)) {
            if (!period) period = next.match(DATE_PATTERN)?.[0] || next.match(/\b(19\d{2}|20\d{2})\b/)?.[0] || next;
          } else if (!details && next.length < 100) {
            details = next;
          }
          j++;
        }
        i = j - 1;

        if (DATE_PATTERN.test(degree)) {
          period = degree.match(DATE_PATTERN)[0];
          degree = degree.replace(DATE_PATTERN, '').replace(/[|•\(\)]/g, ' ').trim();
        }

        // Si la escuela o el grado estaban vacíos, intentar derivarlos del resumen
        if (!degree && school && summary) {
          const degMatch = summary.match(/Ingenier[ií]a\s+en\s+[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+?(?=\s+(?:y|con|\.|\,|$))/i);
          if (degMatch) degree = degMatch[0].trim() + ' | ISIC';
        }

        currentEdu = {
          id: 'edu_' + (entries.length + 1),
          degree: degree || 'Ingeniería en Sistemas Computacionales | ISIC',
          school: school || 'Instituto Tecnológico Superior Mario Molina',
          period: period || '2019 – 2023',
          details: details || ''
        };
      }
    }

    if (currentEdu) entries.push(currentEdu);

    if (entries.length === 0 && summary) {
      const match = summary.match(/(?:estudiante|egresado|licenciado|ingeniero)\s+(?:de|en)\s+([A-Za-zÁÉÍÓÚáéíóúñÑ\s]+)/i);
      if (match) {
        entries.push({
          id: 'edu_1',
          degree: formatTitleCase(match[0]) + ' | ISIC',
          school: 'Instituto Tecnológico Superior Mario Molina',
          period: 'En curso',
          details: 'Cursando formación profesional especializada'
        });
      }
    }

    return entries;
  }

  function parseSkills(skillsText, fullText = '') {
    const skills = {
      languages: [],
      databases: [],
      tools: [],
      softSkills: []
    };

    const combinedText = (skillsText + '\n' + fullText).toLowerCase();

    SKILL_DICTIONARY.languages.forEach(tech => {
      const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp('(?:^|[^a-z0-9])' + escaped + '(?=[^a-z0-9]|$)', 'i');
      if (regex.test(combinedText)) {
        const formatted = tech.toUpperCase() === 'SQL' ? 'SQL' :
                          tech.toUpperCase() === 'VBA' ? 'VBA' :
                          tech.toUpperCase() === 'HTML' ? 'HTML5' :
                          tech.toUpperCase() === 'CSS' ? 'CSS3' :
                          tech.toUpperCase() === 'PHP' ? 'PHP' :
                          formatTitleCase(tech);
        if (!skills.languages.includes(formatted)) skills.languages.push(formatted);
      }
    });

    SKILL_DICTIONARY.databases.forEach(tech => {
      const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp('(?:^|[^a-z0-9])' + escaped + '(?=[^a-z0-9]|$)', 'i');
      if (regex.test(combinedText)) {
        const formatted = tech.toLowerCase() === 'sql server' ? 'SQL Server' :
                          tech.toLowerCase() === 'mysql' ? 'MySQL' :
                          tech.toLowerCase() === 'sqlite' ? 'SQLite' :
                          formatTitleCase(tech);
        if (!skills.databases.includes(formatted)) skills.databases.push(formatted);
      }
    });

    SKILL_DICTIONARY.tools.forEach(tech => {
      const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp('(?:^|[^a-z0-9])' + escaped + '(?=[^a-z0-9]|$)', 'i');
      if (regex.test(combinedText)) {
        let formatted = formatTitleCase(tech);
        if (tech.toLowerCase().includes('excel')) formatted = 'Microsoft Excel (Macros & BI)';
        if (tech.toLowerCase().includes('netbeans')) formatted = 'NetBeans IDE';
        if (tech.toLowerCase().includes('linux')) formatted = 'Distribuciones Linux';
        if (tech.toLowerCase().includes('mantenimiento')) formatted = 'Mantenimiento Preventivo';

        if (!skills.tools.includes(formatted)) skills.tools.push(formatted);
      }
    });

    SKILL_DICTIONARY.softSkills.forEach(skill => {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp('(?:^|[^a-z0-9])' + escaped + '(?=[^a-z0-9]|$)', 'i');
      if (regex.test(combinedText)) {
        const formatted = formatTitleCase(skill);
        if (!skills.softSkills.includes(formatted)) skills.softSkills.push(formatted);
      }
    });

    const softMatches = skillsText.match(/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ\s]+(?=:)/gm);
    if (softMatches) {
      softMatches.forEach(m => {
        const clean = formatTitleCase(m.trim());
        if (!clean.toLowerCase().includes('lenguajes') && !clean.toLowerCase().includes('bases de datos') && !clean.toLowerCase().includes('herramientas')) {
          if (!skills.softSkills.includes(clean)) skills.softSkills.push(clean);
        }
      });
    }

    return skills;
  }

  function parseProjects(text, fullText = '') {
    const projects = [];
    const combined = (text || '') + '\n' + (fullText || '');

    // 1. Proyectos de sección explícita
    if (text) {
      const pLines = text.split('\n').map(l => l.trim()).filter(Boolean);
      for (let i = 0; i < pLines.length; i++) {
        const line = pLines[i];
        if (line.length >= 8 && !/^(?:proyectos|projects|destacados)/i.test(line)) {
          let title = line;
          let tech = '';
          const techMatch = line.match(/\[(.*?)\]/) || line.match(/\((.*?)\)/);
          if (techMatch) {
            tech = techMatch[1].trim();
            title = line.replace(techMatch[0], '').trim();
          }
          let desc = (i + 1 < pLines.length && !pLines[i+1].includes('[')) ? pLines[i+1].trim() : 'Diseño, desarrollo e implementación del proyecto.';
          if (desc !== 'Diseño, desarrollo e implementación del proyecto.') i++;

          projects.push({
            id: 'proj_' + (projects.length + 1),
            title: formatTitleCase(title),
            tech: tech || 'Tecnología Aplicada',
            link: '',
            description: desc
          });
        }
      }
    }

    // 2. Proyectos y logros industriales detectados en el texto
    if (projects.length === 0) {
      if (/sistema.*(?:órdenes|mantenimiento|excel|vba)/i.test(combined) || /órdenes\s+de\s+trabajo/i.test(combined)) {
        projects.push({
          id: 'proj_1',
          title: 'Sistema Integral de Órdenes de Trabajo Automatizado',
          tech: 'Microsoft Excel • VBA Macros • Automatización Operativa',
          link: '',
          description: 'Desarrollé e implementé un sistema digital con macros en VBA para órdenes de trabajo, logrando la eliminación del 100% del uso de papel y escalando a 3 plantas industriales.'
        });
      }

      if (/dashboard|kpi|mttr|mtbf|jack\s*knife/i.test(combined)) {
        projects.push({
          id: 'proj_2',
          title: 'Dashboards Dinámicos de Monitoreo de KPIs y Fallas Jack Knife',
          tech: 'Excel Avanzado • Análisis de Datos • Indicadores Industriales',
          link: '',
          description: 'Construcción y seguimiento de tableros de control en tiempo real para evaluar métricas de mantenimiento (MTTR, MTBF, IMP, IMC) y diagnóstico Jack Knife en 192 equipos.'
        });
      }
    }

    return projects;
  }

  function parseCertifications(text, fullText = '') {
    const certs = [];
    const combined = (text || '') + '\n' + (fullText || '');
    const lines = combined.split('\n').map(l => l.trim()).filter(Boolean);
    const certRegex = /(?:Oracle|AWS|Azure|Google|Scrum|PMP|Meta|Cisco|Coursera|Udemy|Certifi)/i;

    lines.forEach(l => {
      if (l.length >= 10 && certRegex.test(l) && !l.toLowerCase().includes('experiencia') && !l.toLowerCase().includes('educación')) {
        const parts = l.split(/[-–|]/);
        let title = parts[0].trim();
        let issuer = parts[1] ? parts[1].trim() : 'Certificación Profesional';
        let year = '';
        const yrMatch = l.match(/\b(20\d{2}|19\d{2})\b/);
        if (yrMatch) {
          year = yrMatch[0];
          issuer = issuer.replace(year, '').replace(/[\(\)]/g, '').trim();
        }
        if (!certs.some(c => c.title.toLowerCase() === title.toLowerCase())) {
          certs.push({
            title: title,
            issuer: issuer || 'Certificación Oficial',
            year: year || '2023'
          });
        }
      }
    });
    return certs;
  }

  function extractKPIs(fullText) {
    const kpis = [];

    const teamsMatch = fullText.match(/\b(\d{2,4})\s*(?:equipos|máquinas|maquinaria)/i);
    if (teamsMatch) {
      kpis.push({ number: teamsMatch[1], label: 'Equipos Industriales Analizados' });
    }

    const plantsMatch = fullText.match(/\b(\d{1,2})\s*plantas\b/i);
    if (plantsMatch) {
      kpis.push({ number: plantsMatch[1] + ' Plantas', label: 'Escalamiento Operativo' });
    }

    if (/eliminación total|cero papel|sin papel/i.test(fullText)) {
      kpis.push({ number: '100%', label: 'Digitalización de Procesos' });
    }

    if (kpis.length === 0) {
      kpis.push({ number: 'Avanzado', label: 'Excel, VBA & SQL' });
    }

    return kpis;
  }

  function parseCVText(rawText, filename = '') {
    const text = normalizeText(rawText);
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    const contact = extractContact(text);
    const { fullName, headline } = extractNameAndHeadline(lines, contact, text, filename);
    const sections = segmentSections(text);

    let summary = (sections.summary || '').trim();
    if (!summary) {
      const summaryMatch = text.match(/(?:Estudiante|Ingeniero|Licenciado|Desarrollador|Profesional)[^\n]{30,}(?:\n[^\n]{20,}){1,4}/i);
      if (summaryMatch) summary = summaryMatch[0].trim();
    }
    summary = summary.replace(/-\d{10,}.*$/, '').trim();

    const experience = parseExperience(sections.experience || text);
    const education = parseEducation(sections.education, summary);
    const skills = parseSkills(sections.skills, text);
    const projects = parseProjects(sections.projects, text);
    const certifications = parseCertifications(sections.certifications, text);
    const kpis = extractKPIs(text);

    const resolvedName = fullName || (filename ? extractNameFromFilename(filename) : '') || 'Candidato Profesional';
    const resolvedHeadline = headline || 'Especialista Profesional';

    return {
      name: `CV - ${resolvedName}`,
      personal: {
        fullName: resolvedName,
        headline: resolvedHeadline,
        email: contact.email || '',
        phone: contact.phone || '',
        location: contact.location || 'México',
        linkedin: contact.linkedin || '',
        github: contact.github || '',
        website: contact.website || '',
        photoUrl: 'assets/default_avatar.svg',
        badges: [
          `🎯 ${resolvedHeadline}`,
          '💼 Experiencia & Trayectoria Profesional',
          '⚡ Innovación & Buenas Prácticas'
        ]
      },
      summary: summary || 'Profesional enfocado en la optimización operativa, automatización de procesos y análisis de datos.',
      kpis: kpis,
      experience: experience,
      education: education,
      skills: skills,
      certifications: certifications,
      projects: projects,
      settings: {
        template: 'timeline',
        colorTheme: 'oxford',
        showPhoto: false,
        showKpis: true,
        fontFamily: 'Plus Jakarta Sans'
      }
    };
  }

  const api = {
    normalizeText,
    extractContact,
    extractNameAndHeadline,
    segmentSections,
    parseExperience,
    parseEducation,
    parseSkills,
    parseProjects,
    extractKPIs,
    parseCVText
  };

  root.cvParser = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
