// จุดเริ่มต้น: ผูกปุ่มบนหน้าจอเข้ากับฟังก์ชัน

import { $ } from './util.js';
import { state } from './state.js';
import { stageOf } from './data/stages.js';
import { closeOverlay, placeholder } from './ui/overlays.js';
import { scrollLog } from './ui/log.js';
import { openRelations } from './ui/relations.js';
import { openSkills } from './ui/skills.js';
import { openSettings } from './ui/settings.js';
import { openEditor } from './ui/editor.js';
import { startNewLife, pressAge } from './game.js';

$('btnRandom').addEventListener('click', () => {
  startNewLife();
  $('start').hidden = true;
  $('game').hidden = false;
  scrollLog();
});

$('btnAge').addEventListener('click', pressAge);
$('btnRel').addEventListener('click', openRelations);
$('relClose').addEventListener('click', () => { closeOverlay('relOverlay'); });
$('btnDeep').addEventListener('click', openSkills);
$('btnStage').addEventListener('click', () => { placeholder(stageOf(state.age).name); });
$('btnAssets').addEventListener('click', () => { placeholder('ทรัพย์สิน'); });
$('btnAct').addEventListener('click', () => { placeholder('กิจกรรม'); });
$('btnMenu').addEventListener('click', () => { placeholder('เมนู'); });
$('figure').addEventListener('click', openEditor);
$('btnSettings').addEventListener('click', openSettings);
$('sheetClose').addEventListener('click', () => { closeOverlay('sheetOverlay'); });
$('sheetOverlay').addEventListener('click', (e) => {
  if (e.target === $('sheetOverlay')) { closeOverlay('sheetOverlay'); }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeOverlay('sheetOverlay'); closeOverlay('relOverlay'); }
});
