var GOLDHEN_VERSIONS = {
    'GHv2.4b18.13': 'goldhen_v2.4b18.13.bin',
    'GHv2.4b18.12': 'goldhen_v2.4b18.12.bin',
    'GHv2.4b18.10': 'goldhen_v2.4b18.10.bin',
    'GHv2.4b18.9':  'goldhen_v2.4b18.9.bin',
    'GHv2.4b18.8':  'goldhen_v2.4b18.8.bin',
    'GHv2.4b18.7':  'goldhen_v2.4b18.7.bin',
};

var GOLDHEN_DEFAULT = 'GHv2.4b18.13';
var HEN_BASE_PATH = './includes/payloads/HEN/';
var DEFAULT_HEN = 'GoldHEN';

// This customized host always uses GoldHEN. Keep the upstream payload
// selection logic, but remove the user-facing HEN flavor choice.
function GoldHEN() {
    var version = storage.getString('GHVer', GOLDHEN_DEFAULT);
    var filename = GOLDHEN_VERSIONS[version] || GOLDHEN_VERSIONS[GOLDHEN_DEFAULT];
    storage.session.set('payload_path', HEN_BASE_PATH + filename);
}

function PS4HEN() {
    var PS4HENFile = '';
    if (getPs4FwVersion() == 4.74) PS4HENFile = 'PS4HEN-474.bin';
    else if (getPs4FwVersion() == 4.55) PS4HENFile = 'PS4HEN-455.bin';
    else PS4HENFile = 'PS4HEN.bin';
    storage.session.set('payload_path', HEN_BASE_PATH + PS4HENFile);
}

function nexHEN() {
    storage.session.set('payload_path', HEN_BASE_PATH + 'nexHEN-ps4.elf');
}

function chooseHEN() {
    user.currentJbFlavor = DEFAULT_HEN;
    storage.set('jailbreakFlavor', DEFAULT_HEN);
    GoldHEN();
}

function setGoldHENVer(value) {
    if (user.ps4Fw > 13.00 && value !== GOLDHEN_DEFAULT && value != 'GHv2.4b18.12') {
        alert(window.lang.unsupportedFirmware + user.ps4Fw);
        var goldHenRadio = document.querySelector('input[name="goldhen"][value="' + GOLDHEN_DEFAULT + '"]');
        if (goldHenRadio) goldHenRadio.checked = true;
        return;
    }
    if (!GOLDHEN_VERSIONS[value]) value = GOLDHEN_DEFAULT;
    storage.set('GHVer', value);
}

function loadGoldHENVer() {
    var goldHenVer = storage.getString('GHVer', GOLDHEN_DEFAULT);
    if (!GOLDHEN_VERSIONS[goldHenVer]) goldHenVer = GOLDHEN_DEFAULT;
    var goldHenRadio = document.querySelector('input[name="goldhen"][value="' + goldHenVer + '"]');
    if (goldHenRadio) goldHenRadio.checked = true;
}

function saveJbFlavor(name, value) {
    // Ignore any legacy PS4HEN/nexHEN selection and persist GoldHEN only.
    user.currentJbFlavor = DEFAULT_HEN;
    storage.set('jailbreakFlavor', DEFAULT_HEN);
    var radios = document.querySelectorAll('input[name="hen"], input[name="hen2"]');
    for (var i = 0; i < radios.length; i++) {
        radios[i].checked = radios[i].value === DEFAULT_HEN;
    }
    chooseHEN();
}

function loadJbFlavor() {
    user.currentJbFlavor = DEFAULT_HEN;
    storage.set('jailbreakFlavor', DEFAULT_HEN);
    var radios = document.querySelectorAll('input[name="hen"], input[name="hen2"]');
    for (var i = 0; i < radios.length; i++) {
        radios[i].checked = radios[i].value === DEFAULT_HEN;
    }
    hideHenFlavorChoices();
}

function hideHenFlavorChoices() {
    var ids = [
        'choosejb-initial',
        'PS4HEN-label-initial',
        'nexHEN-label-initial',
        'goldhen-label-exploit',
        'PS4HEN-label-exploit',
        'nexHEN-label-exploit'
    ];
    for (var i = 0; i < ids.length; i++) {
        var element = document.getElementById(ids[i]);
        if (element) element.style.display = 'none';
    }
    var goldHenRadio = document.querySelector('input[name="hen"][value="GoldHEN"]');
    var goldHenRadio2 = document.querySelector('input[name="hen2"][value="GoldHEN"]');
    if (goldHenRadio) goldHenRadio.checked = true;
    if (goldHenRadio2) goldHenRadio2.checked = true;
}

// Preserve the firmware check hook while keeping the HEN choice hidden.
function updateHenFlavorVisibility(fwVersion) {
    hideHenFlavorChoices();
    if (user) {
        user.currentJbFlavor = DEFAULT_HEN;
        storage.set('jailbreakFlavor', DEFAULT_HEN);
    }
}
