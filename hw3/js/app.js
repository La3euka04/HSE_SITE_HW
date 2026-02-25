function pad2(n) { return String(n).padStart(2, '0'); }

function fmtTime(ts) {
  try {
    var d = new Date(ts);
    return pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  } catch (_) {
    return '';
  }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function safeText(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

var KEYWORD_RULES = [
  {
    keys: ['привет', 'здрав', 'hello', 'hi', 'йо', 'ку'],
    replies: [
      'Привет! Я на связи.',
      'Здравствуйте! Что хотите узнать?',
      'Привет 🙂 Можно спросить про учебу, проекты, контакты или карту.'
    ]
  },
  {
    keys: ['как дела', 'как ты', 'чё как', 'че как'],
    replies: [
      'Нормально 🙂 Готов отвечать на вопросы.',
      'Всё ок. Чем помочь?',
      'Работаю в режиме «ответы по ключевым словам» 😄'
    ]
  },
  {
    keys: ['как зовут', 'кто ты', 'ты кто'],
    replies: [
      'Я виртуальный чат автора страницы.',
      'Я бот-автоответчик этой страницы.',
      'Я здесь, чтобы отвечать на простые вопросы и реагировать на ключевые слова.'
    ]
  },
  {
    keys: ['вшэ', 'hse', 'higher school of economics'],
    replies: [
      'ВШЭ — сильная проектная и исследовательская среда.',
      'Про ВШЭ могу рассказать про учебу, нагрузки и формат проектов.',
      'Если нужно — могу подсказать, где на странице искать полезные ссылки.'
    ]
  },
  {
    keys: ['миэм', 'таллин', 'строгино'],
    replies: [
      'МИЭМ — инженерная и математическая база: много практики.',
      'МИЭМ — ул. Таллинская 34. На карте можно быстро перейти к точке.',
      'Если вы рядом со Строгино — посмотрите геопозицию на карте.'
    ]
  },
  {
    keys: ['адрес', 'где находится', 'как добраться', 'карта', 'map'],
    replies: [
      'Карта на странице — можно выбрать слой и перейти к МИЭМ/центру/геопозиции.',
      'Нажмите «МИЭМ» — покажу точку на карте и открою маркер.',
      'Если разрешите геолокацию, покажу вашу точку и масштаб.'
    ]
  },
  {
    keys: ['ии', 'ai', 'ds', 'data', 'ml', 'nlp', 'нейросет', 'модель'],
    replies: [
      'ИИ/DS — интересная область: данные → признаки/модель → метрики → улучшения.',
      'Если расскажете задачу, могу предложить план решения и метрики.',
      'NLP нравится за семантику и работу с текстом.'
    ]
  },
  {
    keys: ['проект', 'портфолио', 'опыт', 'pet', 'github'],
    replies: [
      'Проекты удобно собирать в короткие блоки: цель → стек → результат.',
      'Если у вас есть GitHub, лучше дать ссылку и 2–3 буллета, что сделано.',
      'Пет‑проекты хорошо показывают инициативу: маленькие, но законченные.'
    ]
  },
  {
    keys: ['спорт', 'волейбол', 'хоккей', 'ф1', 'формул'],
    replies: [
      'Спорт помогает держать баланс с учебой 🙂',
      'Волейбол/хоккей — топ, а Ф‑1 иногда спасает выходные.',
      'Если хотите, могу посоветовать, как вписать тренировки в расписание.'
    ]
  },
  {
    keys: ['спасибо', 'спс', 'thx', 'thank'],
    replies: [
      'Пожалуйста 🙂',
      'Рад помочь.',
      'Обращайтесь.'
    ]
  },
  {
    keys: ['почта', 'email', 'контакт', 'связ', 'телеграм', 'tg'],
    replies: [
      'Контакты обычно внизу страницы (footer).',
      'Для связи удобнее почта — посмотрите в конце страницы.',
      'Если нужно — напишите, что именно хотите уточнить, я отвечу здесь.'
    ]
  },
  {
    keys: ['ошибка', 'не работает', 'сломал', 'баг', 'error'],
    replies: [
      'Если что-то не работает: проверьте консоль (F12) и пути к файлам.',
      'На GitHub Pages важно, чтобы пути были относительные и совпадали с папками.',
      'Если микрофон не доступен — откройте страницу по https или через localhost.'
    ]
  }
];

var FALLBACK_REPLIES = [
  'Ок. Уточните вопрос парой слов 🙂',
  'Понял. Можете написать чуть конкретнее?',
  'Я могу отвечать про страницу, карту, контакты и учебу.',
  'Если это про сайт: проверьте пути к файлам и консоль браузера.',
  'Хорошо. Что именно интересует?'
];

var VOICE_REPLIES = [
  'Голосовое получил. Если кратко опишите тему текстом, я отвечу точнее.',
  'Слышу 🙂 Я не распознаю речь, но могу ответить по теме, если напишете ключевые слова.',
  'Принято. Можете добавить 1–2 слова, о чём было сообщение?',
  'Ок! Для точного ответа напишите «ВШЭ», «МИЭМ», «карта», «проекты» или «контакты».'
];

function replyForText(text) {
  var t = safeText(text).toLowerCase();
  if (!t) return pickRandom(FALLBACK_REPLIES);

  for (var i = 0; i < KEYWORD_RULES.length; i++) {
    var rule = KEYWORD_RULES[i];
    for (var k = 0; k < rule.keys.length; k++) {
      if (t.indexOf(rule.keys[k]) !== -1) return pickRandom(rule.replies);
    }
  }
  return pickRandom(FALLBACK_REPLIES);
}

var CHAT_STORAGE_KEY = 'hw3_chat_v2';

function loadChatHistory() {
  try {
    var raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [];
    var parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (_) {
    return [];
  }
}

function saveChatHistory(items) {
  try {
    var safe = [];
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (!it || it.type !== 'text') continue;
      safe.push({ from: it.from, type: 'text', text: it.text, ts: it.ts });
    }
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(safe));
  } catch (_) {}
}

function supportsTTS() {
  return typeof window !== 'undefined'
    && typeof window.speechSynthesis !== 'undefined'
    && typeof window.SpeechSynthesisUtterance !== 'undefined';
}

function speakText(text) {
  if (!supportsTTS()) return;
  try {
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(String(text || ''));
    u.lang = 'ru-RU';
    window.speechSynthesis.speak(u);
  } catch (_) {}
}

function makeMsgEl(doc, item) {
  var wrap = doc.createElement('div');
  wrap.className = 'msg ' + (item.from === 'me' ? 'msg--me' : 'msg--bot');

  var bubble = doc.createElement('div');
  bubble.className = 'bubble';

  if (item.type === 'audio' && item.audioUrl) {
    var p = doc.createElement('p');
    p.textContent = item.text || (item.from === 'me' ? 'Голосовое сообщение' : 'Голосовой ответ');
    p.style.margin = '0 0 8px';
    bubble.appendChild(p);

    var audio = doc.createElement('audio');
    audio.controls = true;
    audio.src = item.audioUrl;
    audio.preload = 'metadata';
    bubble.appendChild(audio);
  } else {
    var text = doc.createElement('p');
    text.textContent = item.text || '';
    text.style.margin = '0';
    bubble.appendChild(text);

    if (item.from === 'bot' && item.type === 'text' && supportsTTS()) {
      var ttsBtn = doc.createElement('button');
      ttsBtn.type = 'button';
      ttsBtn.className = 'tts-btn';
      ttsBtn.title = 'Озвучить';
      ttsBtn.setAttribute('aria-label', 'Озвучить');
      ttsBtn.textContent = '🔊';
      ttsBtn.addEventListener('click', function() {
        speakText(item.text || '');
      });
      bubble.appendChild(ttsBtn);
    }
  }

  var meta = doc.createElement('div');
  meta.className = 'meta';

  var who = doc.createElement('span');
  who.textContent = (item.from === 'me') ? 'Вы' : 'Автор';
  meta.appendChild(who);

  var time = doc.createElement('span');
  time.textContent = fmtTime(item.ts);
  meta.appendChild(time);

  bubble.appendChild(meta);
  wrap.appendChild(bubble);
  return wrap;
}

function appendMsg(doc, logEl, items, item) {
  items.push(item);
  saveChatHistory(items);

  logEl.appendChild(makeMsgEl(doc, item));
  logEl.scrollTop = logEl.scrollHeight;
}

function supportsMediaRecorder() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
}

function startRecording(onDone, onError) {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
    var chunks = [];
    var rec = new MediaRecorder(stream);

    rec.ondataavailable = function(e) {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    rec.onerror = function(e) {
      try { stream.getTracks().forEach(function(t) { t.stop(); }); } catch (_) {}
      onError && onError(e && e.error ? e.error : e);
    };

    rec.onstop = function() {
      try { stream.getTracks().forEach(function(t) { t.stop(); }); } catch (_) {}
      var blob = new Blob(chunks, { type: 'audio/webm' });
      var url = URL.createObjectURL(blob);
      onDone && onDone(url);
    };

    rec.start();
    onDone && onDone(null, rec);
  }).catch(function(err) {
    onError && onError(err);
  });
}

function initLeafletMap(doc) {
  var mapEl = doc.getElementById('map');
  if (!mapEl) return null;

  var st = doc.getElementById('map-status');
  if (typeof window.L === 'undefined') {
    if (st) st.textContent = 'Карта не загрузилась (нет Leaflet).';
    return null;
  }

  var miem = [55.803474, 37.409846];
  var center = [55.7558, 37.6173];

  var map = window.L.map(mapEl, { scrollWheelZoom: true }).setView(miem, 14);

  var layerLight = window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  });

  var layerOSM = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  });

  var layerTopo = window.L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap'
  });

  layerLight.addTo(map);

  window.L.control.layers(
    { 'Светлая': layerLight, 'Стандарт': layerOSM, 'Рельеф': layerTopo },
    null,
    { position: 'topright' }
  ).addTo(map);

  var marker = window.L.marker(miem).addTo(map).bindPopup('МИЭМ НИУ ВШЭ • Таллинская 34').openPopup();

  function goto(latlng, zoom, label) {
    map.setView(latlng, zoom);
    if (label) marker.setLatLng(latlng).setPopupContent(label).openPopup();
  }

  var btnMiem = doc.getElementById('map-btn-miem');
  var btnCenter = doc.getElementById('map-btn-center');
  var btnMe = doc.getElementById('map-btn-me');

  if (btnMiem) btnMiem.addEventListener('click', function() {
    goto(miem, 14, 'МИЭМ НИУ ВШЭ • Таллинская 34');
    if (st) st.textContent = '';
  });

  if (btnCenter) btnCenter.addEventListener('click', function() {
    goto(center, 12, 'Центр Москвы');
    if (st) st.textContent = '';
  });

  if (btnMe) btnMe.addEventListener('click', function() {
    if (!navigator.geolocation) {
      if (st) st.textContent = 'Геолокация не поддерживается.';
      return;
    }
    if (st) st.textContent = 'Запрашиваю геопозицию...';
    navigator.geolocation.getCurrentPosition(function(pos) {
      var me = [pos.coords.latitude, pos.coords.longitude];
      goto(me, 15, 'Моя геопозиция');
      if (st) st.textContent = '';
    }, function(err) {
      if (st) st.textContent = 'Геолокация недоступна: ' + (err && err.message ? err.message : 'ошибка');
    }, { enableHighAccuracy: true, timeout: 8000 });
  });

  return map;
}

function drawCanvas(doc) {
  var s = doc.getElementById('js-status');
  if (s) s.textContent = 'включён';

  var c = doc.getElementById('c1');
  if (!c || !c.getContext) return;

  var ctx = c.getContext('2d');
  var w = c.width, h = c.height;

  ctx.clearRect(0, 0, w, h);

  var g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, 'rgba(124,92,255,0.28)');
  g.addColorStop(1, 'rgba(34,197,94,0.20)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.font = '700 18px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
  ctx.fillText('Canvas: мини-визитка', 16, 44);

  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = '14px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
  ctx.fillText('HTML + CSS + JS', 16, 72);
}

window.onload = function() {
  var doc = document;

  drawCanvas(doc);
  initLeafletMap(doc);

  var logEl = doc.getElementById('chat-log');
  var formEl = doc.getElementById('chat-form');
  var inputEl = doc.getElementById('chat-input');
  var voiceBtn = doc.getElementById('chat-voice');
  var statusEl = doc.getElementById('chat-status');
  var ttsEl = doc.getElementById('chat-tts');

  if (!logEl || !formEl || !inputEl || !voiceBtn) return;

  var ttsEnabled = !!(ttsEl && ttsEl.checked);

  if (ttsEl) {
    ttsEl.addEventListener('change', function() {
      ttsEnabled = !!ttsEl.checked;
      if (ttsEnabled) speakText('Озвучивание включено');
    });
  }

  var items = loadChatHistory();

  logEl.innerHTML = '';
  for (var i = 0; i < items.length; i++) {
    logEl.appendChild(makeMsgEl(doc, items[i]));
  }
  logEl.scrollTop = logEl.scrollHeight;

  if (items.length === 0) {
    appendMsg(doc, logEl, items, {
      from: 'bot',
      type: 'text',
      text: 'Привет! Напишите сообщение или отправьте голосовое.',
      ts: Date.now()
    });
  }

  function setChatStatus(t) {
    if (statusEl) statusEl.textContent = t || '';
  }

  function sendBotText(text, forceSpeak) {
    appendMsg(doc, logEl, items, { from: 'bot', type: 'text', text: text, ts: Date.now() });
    if (forceSpeak || ttsEnabled) speakText(text);
  }

  formEl.addEventListener('submit', function(e) {
    e.preventDefault();
    var text = safeText(inputEl.value);
    if (!text) return;

    appendMsg(doc, logEl, items, { from: 'me', type: 'text', text: text, ts: Date.now() });
    inputEl.value = '';
    setChatStatus('');

    var reply = replyForText(text);
    var delay = 350 + Math.floor(Math.random() * 900);
    window.setTimeout(function() { sendBotText(reply, false); }, delay);
  });

  var isRecording = false;
  var activeRecorder = null;

  function setVoiceUi(recording) {
    isRecording = recording;
    voiceBtn.setAttribute('aria-pressed', recording ? 'true' : 'false');
    voiceBtn.classList.toggle('ui-btn--danger', recording);
    voiceBtn.textContent = recording ? '⏹ Стоп' : '🎤 Голос';
  }

  if (!supportsMediaRecorder()) {
    setChatStatus('Голосовые сообщения недоступны в этом браузере.');
    voiceBtn.disabled = true;
    return;
  }

  voiceBtn.addEventListener('click', function() {
    if (!isRecording) {
      setChatStatus('Запись... (нажмите «Стоп» чтобы отправить)');
      setVoiceUi(true);

      startRecording(function(url, rec) {
        if (rec) { activeRecorder = rec; return; }

        appendMsg(doc, logEl, items, {
          from: 'me',
          type: 'audio',
          text: 'Голосовое сообщение',
          audioUrl: url,
          ts: Date.now()
        });

        setChatStatus('');
        setVoiceUi(false);
        activeRecorder = null;

        var reply = pickRandom(VOICE_REPLIES);
        var delay = 450 + Math.floor(Math.random() * 900);
        window.setTimeout(function() { sendBotText(reply, true); }, delay);
      }, function(err) {
        setChatStatus('Не удалось начать запись: ' + (err && err.message ? err.message : 'ошибка'));
        setVoiceUi(false);
        activeRecorder = null;
      });

      return;
    }

    try {
      if (activeRecorder && activeRecorder.state !== 'inactive') activeRecorder.stop();
    } catch (_) {
      setVoiceUi(false);
      setChatStatus('');
      activeRecorder = null;
    }
  });
	const chatLog = document.querySelector('.chat-log');
	const chatClear = document.getElementById('chatClear');

	if (chatClear && chatLog) {
	  chatClear.addEventListener('click', () => {
		chatLog.innerHTML = '';
		localStorage.removeItem('chatHistory');
	  });
	}
};
