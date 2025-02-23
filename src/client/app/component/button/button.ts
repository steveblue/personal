import { Component, Emitter, Listen, State } from '@readymade/core';
import { ButtonComponent } from '@readymade/dom';

import style from './button.css?raw';
import template from './button.html?raw';

class ButtonState {
  public model: string = 'Hello Readymade!';
  public message: string = 'Sent from Readymade';
}

@Component({
  selector: 'rd-button',
  custom: { extends: 'button' },
  style: style,
  template: template,
})
class RdButtonComponent extends ButtonComponent {
  constructor() {
    super();
  }

  @State()
  public getState() {
    return new ButtonState();
  }

  @Emitter('bang', { bubbles: true, composed: true }, 'main')
  @Listen('click')
  public onClick(event: MouseEvent) {
    this.sendMessage(this.getState().message);
  }
  @Listen('keyup')
  public onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage(this.getState().message);
    }
  }

  sendMessage(msg: string) {
    this.emitter.broadcast(
      new CustomEvent('bang', {
        detail: {
          message: msg,
        },
      }),
      'main',
    );
  }
}

// customElements.define('rd-button', RdButtonComponent, { extends: 'button' });

export { RdButtonComponent };
