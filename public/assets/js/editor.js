const COLORS = ['#0025eb', '#9a00eb', '#f500c3', '#f50011', '#f58000', '#70c723', '#38bcb7', '#1E3C00', '#D2AA1B', '#460000'];

class Editor {
  constructor() {
    this.elements = {};
    this.editor = null;
    this.socket = null;
    this.clientId = null;
    this.clientName = window.locals.userName || 'Coder';
    this.userId = window.locals.userId || null;
    this.activeRoom = window.location.pathname.split('/').pop();
    this.presets = window.locals.presets;
    this.coders = {};

    this._init();
  }

  _templateCoderItem(coder) {
    return `
            <li class="collection-item avatar coder-item">
                <i class="material-icons circle" style="background-color: ${coder.color}">person</i>
                <span class="title">${coder.name}</span>
            </li>
        `;
  }

  _updateCodersList() {
    this.elements.codersList.empty();

    Object.values(this.coders).forEach((coder) => {
      this.elements.codersList.append(this._templateCoderItem(coder));
    });
  }

  _initEditor() {
    const text = this.elements.code.text();

    this.elements.code.empty();

    const mode = window.localStorage.getItem('mode') || 'javascript';
    const theme = window.localStorage.getItem('theme') || 'default';

    this.editor = CodeMirror(this.elements.code.get(0), {
      value: text,
      mode,
      theme,
      tabSize: 2,
      lineNumbers: true,
      hint: CodeMirror.hint.javascript,
    });

    this.editor.on('inputRead', (editor, input) => {
      if (input.text[0] === ';' || input.text[0] === ' ' || !input.text[0].match(/[a-z]/i)) { return; }
      CodeMirror.commands.autocomplete(this.editor, null, { completeSingle: false });
    });

    this.editor.on('change', (i, change) => {
      if (change.origin === 'gen' || change.origin === 'setValue') return;

      this.socket.emit('chatToServer', {
        room: this.activeRoom,
        sender: this.clientId,
        code: this.editor.getValue(),
        message: {
          text: change.text,
          from: {
            line: change.from.line,
            ch: change.from.ch,
          },
          to: {
            line: change.to.line,
            ch: change.to.ch,
          },
        },
      });

      this._changeCursors();
    });

    this._initSelect(mode, theme);
  }

  _initDropdown() {
    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));
  }

  _initSelect(mode, theme) {
    this.elements.language.val(mode);
    this.elements.theme.val(theme);
    M.FormSelect.init(document.querySelectorAll('select'));
  }

  _initModal() {
    M.Modal.init(document.querySelectorAll('.modal'));
  }

  _receiveChatMessage(message) {
    this.editor.replaceRange(
      message.text,
      message.from,
      message.to,
      'gen',
    );
  }

  _socketConnect() {
    this.socket = io.connect(`ws://${window.location.hostname}:${window.location.port}`, {
      transports: ['websocket', 'polling'],
      timeout: 4000,
    });

    this.socket.on('chatToClient', ({ sender, message }) => {
      if (sender !== this.clientId) {
        this._receiveChatMessage(message);
      }
    });

    this.socket.on('connect', () => this._handleConnect());

    this.socket.on('joinedRoom', ({ coders, code, id }) => {
      this.editor.setValue(code);

      if (id === this.clientId) {
        Object.keys(coders).forEach((coderId) => {
          this._initCoder(coderId, coders[coderId]);
        });
      } else {
        this._initCoder(id, coders[id]);
      }

      this._updateCodersList();
    });
    this.socket.on('leftRoom', ({ id }) => {
      this._deleteCoder(id);

      this._updateCodersList();
    });

    this.socket.on('savedPreset', (preset) => this._addPreset(preset));

    this.socket.on('disconnect', () => this._handleDisconnect());

    this.socket.on('changedCursors', ({ sender, selections }) => this._setCursors(sender, selections));

    this.socket.on('loadedPreset', ({ code }) => this._recievePreset(code));
  }

  _recievePreset(code) {
    this._hideLoader();

    if (code !== undefined) {
      this._setPreset(code);
    } else {
      M.toast({
        html: 'Error while loading task',
        displayLength: 3000,
      });
    }
  }

  _setCursors(sender, selections) {
    if (!this.coders[sender]) return;
    if (this.clientId === sender) return;

    const senderSelections = this.coders[sender].selections;

    if (senderSelections.instances) {
      senderSelections.instances.forEach((instance) => instance.clear());
      senderSelections.instances = null;
    }

    selections.forEach((selection) => {
      const instance = this._createSelectionInstance(selection, this.coders[sender].color);

      if (!senderSelections.instances) {
        senderSelections.instances = [];
      }

      senderSelections.instances.push(instance);
    });
  }

  _createSelectionInstance(selection, color) {
    const cursorCoords = this.editor.cursorCoords(selection);

    const cursorElement = document.createElement('span');
    cursorElement.style.borderLeftStyle = 'solid';
    cursorElement.style.borderLeftWidth = '2px';
    cursorElement.style.borderLeftColor = color;
    cursorElement.style.height = `${(cursorCoords.bottom - cursorCoords.top)}px`;
    cursorElement.style.padding = 0;
    cursorElement.style.zIndex = 0;
    cursorElement.style.position = 'absolute';

    return this.editor.setBookmark(selection, { widget: cursorElement });
  }

  _initCoder(id, coder) {
    this.coders[id] = {
      name: coder.name,
      selections: {
        instances: null,
      },
      color: this._getUniqueColor(),
    };
  }

  _deleteCoder(id) {
    if (!this.coders[id]) return;

    if (this.coders[id].selections.instances) {
      this.coders[id].selections.instances.forEach((instance) => instance.clear());
      this.coders[id].selections.instances = null;
    }

    delete this.coders[id];
  }

  _deleteAllCoders() {
    Object.keys(this.coders).forEach((id) => this._deleteCoder(id));
    this.coders = {};

    this._updateCodersList();
  }

  _handleDisconnect() {
    this._showLoader();
  }

  _handleConnect() {
    this._deleteAllCoders();
    this._hideLoader();

    this.clientId = this.socket.id;
    this.socket.emit('joinRoom', {
      room: this.activeRoom,
      name: this.clientName,
    });
  }

  _getUniqueColor() {
    const codersColors = Object.values(this.coders).map((coder) => coder.color);

    const uniqColors = COLORS.filter((color) => !codersColors.includes(color));

    return uniqColors[Math.floor(Math.random() * uniqColors.length)];
  }

  _addPreset(preset) {
    this.presets.push({
      name: preset.name,
      value: preset.code,
      id: preset._id,
    });
    this._presetsRefreshItems();
  }

  _removePresetById(id) {
    this.presets = this.presets.filter((preset) => preset.id !== id);

    this.socket.emit('removePreset', {
      ownerId: this.userId,
      _id: id,
    });

    this._presetsRefreshItems();
  }

  _setLanguage(language) {
    this.editor.setOption('mode', language);
    window.localStorage.setItem('mode', language);

    this.socket.emit('changeMode', {
      room: this.activeRoom,
      mode: language,
    });
  }

  _setTheme(theme) {
    this.editor.setOption('theme', theme);
    window.localStorage.setItem('theme', theme);
  }

  _copyToClipboard(text) {
    const $temp = $('<input>');

    $('body').append($temp);
    $temp.val(text).select();
    document.execCommand('copy');
    $temp.remove();
  }

  _shareLink() {
    const _url = new URL(window.location.href);

    const sharedUrl = `${_url.origin}${_url.pathname.replace('sessions', 'shared')}`;

    this._copyToClipboard(sharedUrl);

    M.toast({
      html: `Saved to buffer </br> ${sharedUrl}`,
      displayLength: 3000,
    });
  }

  _openContextmenu(left, top) {
    if (!this.elements.contextmenu.length) return;

    const instance = M.Dropdown.getInstance(this.elements.contextmenu);

    this.elements.contextmenu.css({ left, top });
    instance.open();
  }

  _savePreset() {
    const code = this.editor.getValue();
    const name = this.elements.presetName.val();

    if (!name) {
      M.toast({
        html: 'Name field should not be empty',
        displayLength: 3000,
      });

      return;
    }

    this.socket.emit('savePreset', {
      name,
      code,
      ownerId: this.userId,
    });

    M.toast({
      html: `Preset with name "${name}" was saved`,
      displayLength: 3000,
    });
  }

  _presetsAppendItem(name, code) {
    const $item = this._templatePresetItem(name, code);

    this.elements.presets.append($item);
    M.FormSelect.init(this.elements.presets);
  }

  _presetsRefreshItems() {
    const self = this;

    if (!self.presets) return;

    self.elements.presets.empty();
    self.elements.mangePresetsList.empty();

    if (self.presets.length) {
      const $emptyItem = self._templatePresetItem('(none)', '');
      self.elements.presets.append($emptyItem);

      self.elements.noPresetsSpan.hide();
    } else {
      self.elements.noPresetsSpan.show();
    }

    self.presets.forEach((preset) => {
      const $item = self._templatePresetItem(preset.name, preset.id);
      const $managePresetItem = self._templateManagePresetItem(preset.name, preset.id);

      self.elements.presets.append($item);
      self.elements.mangePresetsList.append($managePresetItem);
    });

    M.FormSelect.init(self.elements.presets);

    this._bindDeletePresetsBtns();
  }

  _initPresets() {
    this._presetsRefreshItems();
  }

  _templatePresetItem(name, id) {
    return $('<option>')
      .attr('value', id)
      .text(name);
  }

  _templateManagePresetItem(name, id) {
    return `<div class="divider"></div>
        <div class="section presets-section">
            <h5 class="left">${name}</h5>
            <a class="btn-floating waves-effect waves-light red right delete-preset-btn" data-preset-id="${id}">
                <i class="material-icons">delete</i>
            </a>
        </div>`;
  }

  _openSavePresetModal() {
    const modal = M.Modal.getInstance(this.elements.presetNameModal);

    modal.open();
  }

  _setPreset(newCode) {
    const code = this.editor.getValue().split(/\n/g);
    const lastLine = code.length - 1;
    const lastLineLength = code[lastLine].length;

    this.editor.setValue(newCode);
    this.editor.refresh();

    this.socket.emit('chatToServer', {
      room: this.activeRoom,
      sender: this.clientId,
      code: newCode,
      message: {
        text: newCode,
        from: {
          line: 0,
          ch: 0,
        },
        to: {
          line: lastLine,
          ch: lastLineLength,
        },
      },
    });
  }

  _openManagePresetsModal() {
    const modal = M.Modal.getInstance(this.elements.managePresetsModal);

    modal.open();
  }

  _changeCursors() {
    const selections = this.editor.listSelections().map((select) => select.head);

    this.socket.emit('changeCursors', {
      room: this.activeRoom,
      sender: this.clientId,
      selections,
    });
  }

  _bindHandlers() {
    const self = this;

    this.elements.language.on('change', function language() {
      self._setLanguage(this.value);
    });

    this.elements.theme.on('change', function theme() {
      self._setTheme(this.value);
    });

    this.elements.share.on('click', () => this._shareLink());

    this.elements.code.on('contextmenu', (event) => {
      event.preventDefault();

      self._openContextmenu(event.pageX, event.pageY);
    });

    this.elements.code.on('click', () => this._changeCursors());
    this.elements.code.keydown((e) => {
      if (e.keyCode >= 37 && e.keyCode <= 40) {
        this._changeCursors();
      }
    });

    this.elements.savePreset.on('click', () => this._openSavePresetModal());

    this.elements.submitPreset.on('click', () => this._savePreset());

    this.elements.presets.on('change', function preset() {
      if (!this.value) {
        self._setPreset('');
        return;
      }

      self.socket.emit('loadPreset', {
        presetId: this.value,
      });

      self._showLoader();
    });

    this.elements.managePresets.on('click', () => this._openManagePresetsModal());

    this._bindDeletePresetsBtns();
  }

  _showLoader() {
    this.elements.codeLoader.show();
  }

  _hideLoader() {
    this.elements.codeLoader.hide();
  }

  _bindDeletePresetsBtns() {
    const self = this;

    this.elements.deletePresetBtns = $('.delete-preset-btn');

    this.elements.deletePresetBtns.on('click', function deletePreset() {
      const presetId = this.attributes['data-preset-id'].value;
      self._removePresetById(presetId);
    });
  }

  _bindElements() {
    this.elements.code = $('#code');
    this.elements.language = $('#language');
    this.elements.theme = $('#theme');
    this.elements.codersList = $('#codersList');
    this.elements.share = $('#share');
    this.elements.contextmenu = $('#contextmenu');
    this.elements.savePreset = $('#savePreset');
    this.elements.presets = $('#presets');
    this.elements.submitPreset = $('#submitPreset');
    this.elements.managePresets = $('#managePresets');
    this.elements.mangePresetsList = $('#managePresetsList');
    this.elements.noPresetsSpan = $('#noPresetsSpan');
    this.elements.codeLoader = $('#codeLoader');
    this.elements.presetName = $('#presetName');

    // Modals
    this.elements.managePresetsModal = $('#managePresetsModal');
    this.elements.presetNameModal = $('#presetNameModal');
  }

  _init() {
    this._bindElements();
    this._bindHandlers();
    this._initDropdown();
    this._initModal();
    this._initEditor();
    this._initPresets();
    this._socketConnect();
  }
}

$(document).ready(() => {
  window.app = window.app || {};
  window.app.Editor = new Editor();
});
