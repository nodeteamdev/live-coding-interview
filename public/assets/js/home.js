class Home {
  constructor() {
    this.elements = {};

    this.init();
  }

  initTable() {
    this.elements.sessionsTable.DataTable({
      columnDefs: [
        { width: '5%', targets: 0 },
      ],
    });
  }

  initModals() {
    M.Modal.init(document.querySelectorAll('.modal'), {});
  }

  _createSession() {
    fetch('sessions/create', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: this.elements.sessionTitle.val(),
      }),
    }).then((res) => res.json()).then(({ data }) => {
      window.location.href = `${window.location.origin}${data.url}`;
    });
  }

  _removeSession() {
    const ids = this.elements.sessionsTable.find('input[type="checkbox"]:checked').map((_, item) => item.dataset.id).get();

    return fetch('sessions/remove', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids,
      }),
    }).then(() => {
      window.location.reload();
    });
  }

  _checkboxHandler() {
    const checkedCount = this.elements.sessionsTable.find('input[type="checkbox"]:checked').length;

    if (checkedCount === 0) {
      this.elements.deleteSession.fadeOut();
    } else {
      this.elements.deleteSession.fadeIn();
    }
  }

  bindHandlers() {
    this.elements.modal.on('click', () => this._createSession());
    this.elements.deleteSession.on('click', () => this._removeSession());
    this.elements.sessionsTable.on('change', '[type="checkbox"]', () => this._checkboxHandler());
  }

  bindElements() {
    this.elements.modal = $('#createSession');
    this.elements.sessionTitle = $('#sessionTitle');
    this.elements.sessionsTable = $('#sessionsTable');
    this.elements.deleteSession = $('#deleteSession');
  }

  init() {
    this.bindElements();
    this.bindHandlers();
    this.initModals();
    this.initTable();
  }
}

$(document).ready(() => {
  window.app = window.app || {};
  window.app.Home = new Home();
});
